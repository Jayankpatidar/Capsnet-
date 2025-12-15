import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConnectionSuggestions } from "../features/ai/aiSlice";
import { UserPlus, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { getProfileImageURL } from '../utils/imageUtils';

const ConnectionSuggestions = () => {
  const dispatch = useDispatch();
  const { connectionSuggestions, loading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(getConnectionSuggestions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          AI Connection Suggestions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          People you might want to connect with based on your profile
        </p>
      </div>

      {connectionSuggestions && connectionSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectionSuggestions.map((user, index) => (
            <motion.div
              key={user._id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={getProfileImageURL(user.profile_picture)}
                  alt={user.full_name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200 dark:border-slate-600 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {user.full_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Briefcase size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{user.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <motion.button
                className="w-full px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserPlus size={16} />
                Connect
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 dark:bg-slate-800 rounded-xl">
          <UserPlus size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No suggestions available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your profile to get better connection suggestions
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionSuggestions;
