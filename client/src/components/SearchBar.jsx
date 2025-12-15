import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchBar = ({
  onSearch,
  placeholder = "Search for users, posts, jobs, companies...",
  showFilters = true,
  searchType = 'all',
  onTypeChange,
  filters = {},
  onFiltersChange
}) => {
  const [query, setQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const searchTypes = [
    { value: 'all', label: 'All' },
    { value: 'users', label: 'Users' },
    { value: 'posts', label: 'Posts' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'companies', label: 'Companies' },
    { value: 'reels', label: 'Reels' },
    { value: 'hashtags', label: 'Hashtags' },
    { value: 'location', label: 'Location' },
    { value: 'skills', label: 'Skills' },
    { value: 'audio-music', label: 'Audio/Music' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType, filters);
    }
  };

  const handleTypeChange = (type) => {
    onTypeChange(type);
    setShowFilterDropdown(false);
  };

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600">
          {/* Search Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 transition-colors border-r border-gray-300 rounded-l-lg dark:text-slate-300 bg-gray-50 dark:bg-slate-700 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              {searchTypes.find(type => type.value === searchType)?.label || 'All'}
              <Filter className="w-4 h-4 ml-2" />
            </button>

            {showFilterDropdown && (
              <div className="absolute left-0 z-50 w-48 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg top-full dark:bg-slate-800 dark:border-slate-600">
                {searchTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                      searchType === type.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 dark:text-slate-100 focus:ring-0 focus:outline-none dark:placeholder-slate-400"
          />

          {/* Search Button */}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-3 text-white transition-colors bg-blue-600 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && searchType !== 'all' && (
        <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Job-specific filters */}
            {searchType === 'jobs' && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType || ''}
                    onChange={(e) => updateFilter('jobType', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Work Type
                  </label>
                  <select
                    value={filters.workType || ''}
                    onChange={(e) => updateFilter('workType', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value="">All</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location || ''}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>
              </>
            )}

            {/* Company-specific filters */}
            {searchType === 'companies' && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={filters.industry || ''}
                    onChange={(e) => updateFilter('industry', e.target.value)}
                    placeholder="Enter industry"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location || ''}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
