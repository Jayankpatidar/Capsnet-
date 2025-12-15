import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { analyzeProfile } from "../features/ai/aiSlice";
import { User, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ProfileAnalyzer = () => {
  const dispatch = useDispatch();
  const { profileAnalysis, loading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(analyzeProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileAnalysis) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No analysis available</p>
        </div>
      </div>
    );
  }

  const { score, suggestions } = profileAnalysis;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Profile Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered insights to improve your profile
        </p>
      </div>

      {/* Score Display */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${score}, 100`}
              className={getScoreColor(score)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
        </div>
        <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
          {score >= 80 ? "Excellent Profile!" : score >= 60 ? "Good Profile" : "Needs Improvement"}
        </p>
      </motion.div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Suggestions to Improve:
          </h3>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AlertCircle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 dark:text-yellow-200">{suggestion}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {suggestions && suggestions.length === 0 && (
        <motion.div
          className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Perfect Profile!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Your profile is well-optimized. Keep up the great work!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileAnalyzer;
