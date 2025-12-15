import React from "react";
import { getProfileImageURL, getImageURL } from '../utils/imageUtils';
import { Link } from "react-router-dom";
import { MapPin, Users, Briefcase, Building, Hash, Music, Star } from "lucide-react";

const SearchResults = ({ results, loading, error, searchType, onLoadMore }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!results || !results.data || results.data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">No results found</p>
      </div>
    );
  }

  const renderUserCard = (user) => (
    <Link
      key={user._id}
      to={`/profile/${user._id}`}
      className="block p-4 transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <img
          src={getProfileImageURL(user.profile_picture)}
          alt={user.full_name}
          className="object-cover w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{user.full_name}</h3>
          <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          {user.professional_headline && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{user.professional_headline}</p>
          )}
          {user.location && (
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {user.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  const renderPostCard = (post) => (
    <Link
      key={post._id}
      to={`/post/${post._id}`}
      className="block p-4 transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
    >
      <div className="flex items-start space-x-4">
        <img
          src={getProfileImageURL(post.user?.profile_picture)}
          alt={post.user?.full_name}
          className="object-cover w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center mb-2 space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{post.user?.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400">@{post.user?.username}</p>
          </div>
          <p className="mb-2 text-gray-800 dark:text-gray-200">{post.content}</p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.hashtags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-sm text-blue-500">#{tag}</span>
              ))}
              {post.hashtags.length > 3 && (
                <span className="text-sm text-gray-500">+{post.hashtags.length - 3} more</span>
              )}
            </div>
          )}
          {post.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {post.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  const renderJobCard = (job) => (
    <Link
      key={job._id}
      to={`/jobs/${job._id}`}
      className="block p-4 transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
          <p className="mb-2 text-gray-600 dark:text-gray-400">{job.company}</p>
          <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {job.jobType}
            </span>
            <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
              {job.workType}
            </span>
          </div>
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${job.salary?.min}-{job.salary?.max}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{job.salary?.period}</p>
        </div>
      </div>
    </Link>
  );

  const renderCompanyCard = (company) => (
    <Link
      key={company._id}
      to={`/companies/${company._id}`}
      className="block p-4 transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
    >
      <div className="flex items-start space-x-4">
        <img
          src={company.logo || "/default-avatar.png"}
          alt={company.name}
          className="object-cover w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{company.name}</h3>
          <p className="mb-2 text-gray-600 dark:text-gray-400">{company.industry}</p>
          <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {company.location}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{company.description}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{company.company_size} employees</p>
        </div>
      </div>
    </Link>
  );

  const renderReelCard = (reel) => (
    <Link
      key={reel._id}
      to={`/reels/${reel._id}`}
      className="block p-4 transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
    >
      <div className="flex items-start space-x-4">
        <img
          src={getProfileImageURL(reel.user?.profile_picture)}
          alt={reel.user?.full_name}
          className="object-cover w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center mb-2 space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{reel.user?.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400">@{reel.user?.username}</p>
          </div>
          <p className="mb-2 text-gray-800 dark:text-gray-200">{reel.caption}</p>
          {reel.hashtags && reel.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {reel.hashtags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-sm text-blue-500">#{tag}</span>
              ))}
              {reel.hashtags.length > 3 && (
                <span className="text-sm text-gray-500">+{reel.hashtags.length - 3} more</span>
              )}
            </div>
          )}
          {reel.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {reel.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  const renderGlobalResults = () => {
    const { users, posts, jobs, companies, reels } = results;

    return (
      <div className="space-y-8">
        {users && users.data && users.data.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {users.data.map(renderUserCard)}
            </div>
          </div>
        )}

        {posts && posts.data && posts.data.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Hash className="w-5 h-5 mr-2 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Posts</h2>
            </div>
            <div className="space-y-4">
              {posts.data.map(renderPostCard)}
            </div>
          </div>
        )}

        {jobs && jobs.data && jobs.data.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Jobs</h2>
            </div>
            <div className="space-y-4">
              {jobs.data.map(renderJobCard)}
            </div>
          </div>
        )}

        {companies && companies.data && companies.data.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 mr-2 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Companies</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {companies.data.map(renderCompanyCard)}
            </div>
          </div>
        )}

        {reels && reels.data && reels.data.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Music className="w-5 h-5 mr-2 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reels</h2>
            </div>
            <div className="space-y-4">
              {reels.data.map(renderReelCard)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSpecificResults = () => {
    const data = results.data || [];

    switch (searchType) {
      case "users":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {data.map(renderUserCard)}
          </div>
        );
      case "posts":
        return (
          <div className="space-y-4">
            {data.map(renderPostCard)}
          </div>
        );
      case "jobs":
        return (
          <div className="space-y-4">
            {data.map(renderJobCard)}
          </div>
        );
      case "companies":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {data.map(renderCompanyCard)}
          </div>
        );
      case "reels":
        return (
          <div className="space-y-4">
            {data.map(renderReelCard)}
          </div>
        );
      case "hashtags":
      case "location":
      case "skills":
      case "audio-music":
        return (
          <div className="space-y-4">
            {data.map((item) => {
              if (item.content || item.caption) {
                return renderPostCard(item);
              } else if (item.title) {
                return renderJobCard(item);
              } else {
                return renderUserCard(item);
              }
            })}
          </div>
        );
      default:
        return renderGlobalResults();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderSpecificResults()}

      {results.pagination && results.pagination.hasNext && onLoadMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
