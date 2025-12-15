import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Users,
  Eye,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import api, { BASE_URL } from "../api/axios";

// Helper function for image URLs
const getImageURLHelper = (img) => {
  const DEFAULT_AVATAR = "/default-avatar.png";
  if (!img) return DEFAULT_AVATAR;
  if (img.startsWith("http")) return img; // Already full URL
  if (img.startsWith("/")) {
    // Remove /api from BASE_URL to get base server URL
    const baseURL = BASE_URL.replace("/api", "");
    return baseURL + img;
  }
  return img;
};

// Carousel Component
export const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        className="object-cover w-full rounded-lg"
        alt="Carousel image"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Poll Section Component
export const PollSection = ({ pollOptions, onVote, postId, isSponsored }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const currentUser = useSelector((state) => state.user.value);

  const handleVote = async (optionIndex) => {
    if (isSponsored || hasVoted) return;

    setSelectedOption(optionIndex);
    setHasVoted(true);
    await onVote(optionIndex);
  };

  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.votes.length, 0);

  return (
    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-primary" />
        <span className="font-medium">Poll</span>
      </div>

      <div className="space-y-2">
        {pollOptions.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
          const isSelected = selectedOption === index;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleVote(index)}
                disabled={isSponsored || hasVoted}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-white dark:bg-slate-600 border-gray-200 dark:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-500"
                } ${isSponsored || hasVoted ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span className="text-sm text-gray-500">
                    {option.votes.length} votes
                  </span>
                </div>
              </button>

              {hasVoted && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-primary rounded-b-lg transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {totalVotes > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          {totalVotes} total votes
        </div>
      )}
    </div>
  );
};

// Article Section Component
export const ArticleSection = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewLength = 200;
  const shouldShowReadMore = content.length > previewLength;

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-blue-500" />
        <span className="font-medium text-blue-700 dark:text-blue-300">Article</span>
      </div>

      <div className="text-gray-800 dark:text-gray-200">
        {shouldShowReadMore && !isExpanded ? (
          <>
            {content.substring(0, previewLength)}...
            <button
              onClick={() => setIsExpanded(true)}
              className="ml-2 text-blue-500 hover:text-blue-700 font-medium"
            >
              Read more
            </button>
          </>
        ) : (
          content
        )}
      </div>

      {isExpanded && shouldShowReadMore && (
        <button
          onClick={() => setIsExpanded(false)}
          className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
        >
          Show less
        </button>
      )}
    </div>
  );
};

// Document Section Component
export const DocumentSection = ({ documents }) => {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-red-500" />
        <span className="font-medium text-red-700 dark:text-red-300">Documents</span>
      </div>

      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-red-500" />
              <span className="font-medium">{doc.split('/').pop()}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(getImageURLHelper(doc), '_blank')}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = getImageURLHelper(doc);
                  link.download = doc.split('/').pop();
                  link.click();
                }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="Download document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Collaboration Section Component
export const CollaborationSection = ({ collabUsers, content }) => {
  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-green-500" />
        <span className="font-medium text-green-700 dark:text-green-300">Collaboration Post</span>
      </div>

      {collabUsers && collabUsers.length > 0 && (
        <div className="mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Collaborators:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {collabUsers.map((user, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs"
              >
                {typeof user === 'object' ? user.username : user}
              </span>
            ))}
          </div>
        </div>
      )}

      {content && (
        <div className="text-gray-800 dark:text-gray-200">
          {content}
        </div>
      )}
    </div>
  );
};
