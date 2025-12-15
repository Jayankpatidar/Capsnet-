import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobSuggestions } from "../features/ai/aiSlice";
import { Briefcase, MapPin, Building, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const JobSuggestions = () => {
  const dispatch = useDispatch();
  const { jobSuggestions, loading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(getJobSuggestions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          AI Job Suggestions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized job recommendations based on your skills and experience
        </p>
      </div>

      {jobSuggestions && jobSuggestions.length > 0 ? (
        <div className="space-y-6">
          {jobSuggestions.map((job, index) => (
            <motion.div
              key={job._id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <Building size={16} className="mr-2" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin size={16} className="mr-2" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Posted by
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {job.postedBy?.name || "Company"}
                  </div>
                </div>
              </div>

              {job.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {job.description}
                </p>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Briefcase size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Required Skills:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <motion.button
                  className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink size={16} />
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 dark:bg-slate-800 rounded-xl">
          <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No job suggestions available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add more skills to your profile to get personalized job recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSuggestions;
