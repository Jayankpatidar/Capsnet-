import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateCaption } from "../features/ai/aiSlice";
import { Image, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

const CaptionGenerator = () => {
  const [imageDescription, setImageDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const { caption, hashtags, loading } = useSelector((state) => state.ai);

  const handleGenerate = () => {
    if (imageDescription.trim()) {
      dispatch(generateCaption(imageDescription.trim()));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          AI Caption Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Describe your image and get AI-generated captions with hashtags
        </p>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe your image:
        </label>
        <textarea
          value={imageDescription}
          onChange={(e) => setImageDescription(e.target.value)}
          placeholder="e.g., A beautiful sunset over mountains with vibrant colors..."
          className="w-full p-4 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 resize-none"
          rows={4}
        />
        <motion.button
          onClick={handleGenerate}
          disabled={!imageDescription.trim() || loading}
          className="mt-4 w-full px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: imageDescription.trim() && !loading ? 1.02 : 1 }}
          whileTap={{ scale: imageDescription.trim() && !loading ? 0.98 : 1 }}
        >
          <Sparkles size={20} />
          {loading ? "Generating..." : "Generate Caption"}
        </motion.button>
      </div>

      {/* Results */}
      {(caption || hashtags.length > 0) && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {caption && (
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Generated Caption:
                </h3>
                <motion.button
                  onClick={() => copyToClipboard(caption)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{caption}</p>
            </div>
          )}

          {hashtags.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Suggested Hashtags:
                </h3>
                <motion.button
                  onClick={() => copyToClipboard(hashtags.join(" "))}
                  className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {caption && hashtags.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-800 dark:text-green-200">
                  Complete Post:
                </h3>
                <motion.button
                  onClick={() => copyToClipboard(`${caption}\n\n${hashtags.join(" ")}`)}
                  className="p-2 text-green-500 hover:text-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {caption}
                {"\n\n"}
                {hashtags.join(" ")}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CaptionGenerator;
