import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseResume } from "../features/ai/aiSlice";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const ResumeParser = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { resumeData, loading } = useSelector((state) => state.ai);

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      dispatch(parseResume(formData));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          AI Resume Parser
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your resume and let AI extract your skills and experience
        </p>
      </div>

      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-slate-600"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-3">
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Parsing..." : "Parse Resume"}
              </motion.button>
              <motion.button
                onClick={clearFile}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Drop your resume here
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              or click to browse (PDF only)
            </p>
            <motion.button
              className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Choose File
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Results */}
      {resumeData && (
        <motion.div
          className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <CheckCircle size={24} className="text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Resume Parsed Successfully!
            </h3>
          </div>

          {resumeData.parsedData && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Skills Extracted:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.parsedData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {resumeData.parsedData.experience && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Experience:
                  </h4>
                  <div className="space-y-2">
                    {resumeData.parsedData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-slate-700 rounded-lg border"
                      >
                        <p className="font-medium">{exp.role} at {exp.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.start} - {exp.end}
                        </p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.parsedData.education && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Education:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {resumeData.parsedData.education}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeParser;
