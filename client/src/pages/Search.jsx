import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import {
  searchUsers,
  searchPosts,
  searchJobs,
  searchCompanies,
  searchReels,
  searchHashtags,
  searchByLocation,
  searchBySkills,
  searchAudioMusic,
  globalAdvancedSearch,
  clearSearchResults
} from '../features/search/searchSlice';

const Search = () => {
  const dispatch = useDispatch();
  const {
    results,
    loading,
    error,
    currentQuery,
    currentType,
    currentFilters
  } = useSelector((state) => state.search);

  const [searchType, setSearchType] = useState('all');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Clear results when component mounts
    dispatch(clearSearchResults());
  }, [dispatch]);

  const handleSearch = (query, type, searchFilters) => {
    const params = {
      query,
      type,
      filters: searchFilters,
      limit: 20,
      page: 1
    };

    switch (type) {
      case 'users':
        dispatch(searchUsers(params));
        break;
      case 'posts':
        dispatch(searchPosts(params));
        break;
      case 'jobs':
        dispatch(searchJobs(params));
        break;
      case 'companies':
        dispatch(searchCompanies(params));
        break;
      case 'reels':
        dispatch(searchReels(params));
        break;
      case 'hashtags':
        dispatch(searchHashtags(params));
        break;
      case 'location':
        dispatch(searchByLocation(params));
        break;
      case 'skills':
        dispatch(searchBySkills(params));
        break;
      case 'audio-music':
        dispatch(searchAudioMusic(params));
        break;
      case 'all':
      default:
        dispatch(globalAdvancedSearch(params));
        break;
    }
  };

  const handleLoadMore = (type) => {
    const currentPage = results[type]?.pagination?.currentPage || 1;
    const params = {
      query: currentQuery,
      type,
      filters: currentFilters,
      limit: 20,
      page: currentPage + 1
    };

    switch (type) {
      case 'users':
        dispatch(searchUsers(params));
        break;
      case 'posts':
        dispatch(searchPosts(params));
        break;
      case 'jobs':
        dispatch(searchJobs(params));
        break;
      case 'companies':
        dispatch(searchCompanies(params));
        break;
      case 'reels':
        dispatch(searchReels(params));
        break;
      case 'hashtags':
        dispatch(searchHashtags(params));
        break;
      case 'location':
        dispatch(searchByLocation(params));
        break;
      case 'skills':
        dispatch(searchBySkills(params));
        break;
      case 'audio-music':
        dispatch(searchAudioMusic(params));
        break;
    }
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    setFilters({});
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
            Search
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Find users, posts, jobs, companies, and more
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            searchType={searchType}
            onTypeChange={handleTypeChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Search Results */}
        <div className="mb-8">
          {currentQuery && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Search Results for "{currentQuery}"
                {currentType !== 'all' && (
                  <span className="text-lg text-gray-500 dark:text-slate-400">
                    {' '}in {currentType}
                  </span>
                )}
              </h2>
            </div>
          )}

          <SearchResults
            results={results}
            loading={loading}
            error={error}
            searchType={currentType}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* Search Tips */}
        {!currentQuery && (
          <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-slate-800 dark:border-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
              Search Tips
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-slate-100">
                  User Search
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                  <li>• Search by name, username, or bio</li>
                  <li>• Find users by location or skills</li>
                  <li>• Look for professional headlines</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-slate-100">
                  Content Search
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                  <li>• Search posts by content or hashtags</li>
                  <li>• Find reels by caption or music</li>
                  <li>• Discover companies by industry</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-slate-100">
                  Job Search
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                  <li>• Filter by job type and work type</li>
                  <li>• Search by location or skills</li>
                  <li>• Find opportunities by salary range</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-slate-100">
                  Advanced Features
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                  <li>• Use hashtags to find trending topics</li>
                  <li>• Search by location for local content</li>
                  <li>• Find audio/music related content</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
