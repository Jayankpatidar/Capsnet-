import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAIMessage, fetchChatHistory } from "../features/chat/chatSlice";
import { MessageSquare, X, Send, Mic, MicOff, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatList from "./ChatList";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const dispatch = useDispatch();
  const { messages = [], loading } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(fetchChatHistory());
    }
  }, [isOpen, dispatch, messages.length]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Initialize speech recognition and synthesis
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, [language]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      dispatch(sendAIMessage({ message: message.trim(), language }));
      setMessage("");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (synthRef.current && text) {
      // Stop any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  // ✅ Safely handle any value (convert non-string to string)
  const safeText = (value) => {
    if (typeof value === "string" || typeof value === "number") return value;
    if (Array.isArray(value)) return value.join(", ");
    if (value && typeof value === "object")
      return JSON.stringify(value, null, 2);
    return "";
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed z-50 flex flex-col space-y-3 bottom-4 md:bottom-6 right-4 md:right-6">
        {/* Chat List Button */}
        <motion.button
          onClick={() => setIsChatListOpen(!isChatListOpen)}
          className="p-3 text-white transition-all duration-300 border-2 border-white rounded-full shadow-xl bg-gradient-primary hover:shadow-2xl dark:border-slate-800 touch-manipulation min-h-[44px] min-w-[44px]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isChatListOpen
              ? "0 0 30px rgba(59, 130, 246, 0.5)"
              : "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <MessageCircle size={20} />
        </motion.button>

        {/* AI Chat Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 text-white transition-all duration-300 border-2 border-white rounded-full shadow-xl bg-gradient-primary hover:shadow-2xl dark:border-slate-800 touch-manipulation min-h-[44px] min-w-[44px]"
          whileHover={{ scale: 1.1, rotate: isOpen ? 180 : 0 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isOpen
              ? "0 0 30px rgba(59, 130, 246, 0.5)"
              : "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <MessageSquare size={24} />
        </motion.button>
      </div>

      {/* Chat List */}
      <ChatList isOpen={isChatListOpen} onClose={() => setIsChatListOpen(false)} />

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 md:right-6 w-80 md:w-96 h-[24rem] md:h-[28rem] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 z-40 flex flex-col overflow-hidden mobile-fix"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-4 text-white gradient-primary rounded-t-2xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <h3 className="text-lg font-bold">AI Campus Assistant</h3>
                <p className="text-sm opacity-90">
                  Ask me about university info!
                </p>
              </div>
              <motion.select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2 py-1 text-sm text-white border rounded-lg bg-white/20 border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </motion.select>
            </motion.div>

            {/* Messages */}
            <motion.div
              className="flex-1 p-4 space-y-3 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {messages.length === 0 && (
                <motion.div
                  className="text-sm text-center text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Hi! I'm your AI assistant. Ask me about exam dates, course
                  info, or anything university-related!
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-end">
                      <motion.div
                        className="flex items-center max-w-xs p-3 space-x-2 text-white shadow-md gradient-primary rounded-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="flex-1">
                          {safeText(msg.userMessage)}
                        </div>
                        <div className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    </div>
                    <div className="flex justify-start">
                      <motion.div
                        className="flex items-center max-w-xs p-3 space-x-2 text-gray-800 bg-gray-100 shadow-md dark:bg-slate-700 dark:text-gray-200 rounded-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-primary">
                          AI
                        </div>
                        <div className="flex-1">
                          {safeText(msg.aiReply)}
                        </div>
                        <motion.button
                          onClick={() => speakText(safeText(msg.aiReply))}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </motion.button>
                        <div className="text-xs text-gray-500 opacity-70 dark:text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="p-3 text-gray-800 bg-gray-100 shadow-md dark:bg-slate-700 dark:text-gray-200 rounded-2xl">
                    <div className="flex space-x-1">
                      <motion.span
                        className="text-sm"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        AI is typing
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5,
                        }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5,
                        }}
                      >
                        .
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>

            {/* Input */}
            <motion.form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 dark:border-slate-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400"
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isListening
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500"
                  }`}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="p-2 text-white transition-all duration-200 rounded-lg bg-gradient-primary hover:shadow-lg disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                  whileHover={{
                    scale: message.trim() && !loading ? 1.05 : 1,
                  }}
                  whileTap={{
                    scale: message.trim() && !loading ? 0.95 : 1,
                  }}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
