import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Search, Plus, X } from 'lucide-react';
import { fetchConnections } from '../features/connections/connectionsSlice';
import { fetchMessages } from '../features/messages/messagesSlice';
import { getProfileImageURL } from '../utils/imageUtils';

const ChatList = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connections } = useSelector((state) => state.connections);
  const { messages } = useSelector((state) => state.messages);
  const currentUser = useSelector((state) => state.user.value);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchConnections());
    }
  }, [isOpen, dispatch]);

  const filteredConnections = connections.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLastMessage = (userId) => {
    const userMessages = messages.filter(msg => msg.to_user_id === userId || msg.from_user_id === userId);
    return userMessages[userMessages.length - 1];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Chat List Panel */}
          <motion.div
            className="fixed top-0 left-0 z-50 flex flex-col h-full bg-white shadow-2xl w-80 dark:bg-slate-800"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
                <button
                  onClick={onClose}
                  className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConnections.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start chatting with your connections!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredConnections.map((user) => {
                    const lastMessage = getLastMessage(user._id);
                    return (
                      <motion.div
                        key={user._id}
                        className="p-4 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700"
                        onClick={() => {
                          navigate(`/message/${user._id}`);
                          onClose();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={getProfileImageURL(user._id === currentUser._id
                                ? currentUser.profile_picture
                                : user.profile_picture)}
                              alt={user.full_name}
                              className="object-cover w-12 h-12 rounded-full"
                            />
                            <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-slate-800"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                {user.full_name}
                              </h3>
                              {lastMessage && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(lastMessage.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              @{user.username}
                            </p>

                            {lastMessage && (
                              <p className="mt-1 text-sm text-gray-600 truncate dark:text-gray-300">
                                {lastMessage.text || 'Image'}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => {
                  navigate('/message');
                  onClose();
                }}
                className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white transition-all duration-200 rounded-lg bg-gradient-primary hover:shadow-lg"
              >
                <Plus size={18} />
                <span>Start New Chat</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatList;
