import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  User,
  Users,
  Briefcase,
  Bot,
  ChevronRight
} from "lucide-react";
import ResumeParser from "../components/ResumeParser";
import CaptionGenerator from "../components/CaptionGenerator";
import ProfileAnalyzer from "../components/ProfileAnalyzer";
import ConnectionSuggestions from "../components/ConnectionSuggestions";
import JobSuggestions from "../components/JobSuggestions";

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      name: "Overview",
      icon: Bot,
      description: "AI-powered features overview"
    },
    {
      id: "resume",
      name: "Resume Parser",
      icon: FileText,
      description: "Extract skills and experience from your resume"
    },
    {
      id: "caption",
      name: "Caption Generator",
      icon: Image,
      description: "Generate engaging captions and hashtags"
    },
    {
      id: "profile",
      name: "Profile Analyzer",
      icon: User,
      description: "Get insights to improve your profile"
    },
    {
      id: "connections",
      name: "Connection Suggestions",
      icon: Users,
      description: "Find people you should connect with"
    },
    {
      id: "jobs",
      name: "Job Suggestions",
      icon: Briefcase,
      description: "Personalized job recommendations"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "resume":
        return <ResumeParser />;
      case "caption":
        return <CaptionGenerator />;
      case "profile":
        return <ProfileAnalyzer />;
      case "connections":
        return <ConnectionSuggestions />;
      case "jobs":
        return <JobSuggestions />;
      default:
        return <Overview />;
    }
  };

  const Overview = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          AI-Powered Features
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover how artificial intelligence can enhance your professional networking experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabs.slice(1).map((tab, index) => (
          <motion.div
            key={tab.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-lg mr-4">
                <tab.icon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  {tab.name}
                </h3>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {tab.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-primary rounded-2xl p-8 text-white">
          <Bot size={48} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Our AI features use cutting-edge machine learning algorithms to provide personalized insights,
            automate tedious tasks, and help you make better professional connections.
          </p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap mr-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-primary text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AIDashboard;
