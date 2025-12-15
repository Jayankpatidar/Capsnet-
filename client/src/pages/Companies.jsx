import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Search, Building2, Users, MapPin, Briefcase, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getSuggestedCompanies,
  searchCompanies,
  followCompany,
} from "../features/company/companySlice";

const Companies = () => {
  const dispatch = useDispatch();
  const { suggestedCompanies, searchResults, loading } = useSelector(
    (state) => state.company
  );
  const user = useSelector((state) => state.user.value);

  const [activeTab, setActiveTab] = useState("suggested");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.token) {
      dispatch(getSuggestedCompanies());
    }
  }, [dispatch, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    dispatch(searchCompanies(searchQuery.trim()));
    setActiveTab("search");
  };

  const handleSuggested = () => {
    dispatch(getSuggestedCompanies());
    setActiveTab("suggested");
  };

  const handleFollow = async (companyId) => {
    try {
      await dispatch(followCompany(companyId)).unwrap();
      toast.success("Company followed successfully!");
    } catch (error) {
      toast.error("Failed to follow company");
    }
  };

  const handleUnfollow = async (companyId) => {
    try {
      await dispatch(followCompany(companyId)).unwrap();
      toast.success("Company unfollowed successfully!");
    } catch (error) {
      toast.error("Failed to unfollow company");
    }
  };

  const currentCompanies = activeTab === "suggested" ? suggestedCompanies : searchResults;

  return (
    <div className="max-w-6xl p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-text-primary">
          Discover and connect with amazing companies
        </h1>
        <p className="text-text-secondary">
          Find companies in your industry and build professional connections
        </p>
      </div>

      {/* Create Company Link */}
      <div className="mb-6">
        <Link
          to="/company/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-accent hover:bg-accent/90"
        >
          <Plus className="w-4 h-4" />
          Create Company
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 border rounded-lg border-border focus:ring-2 focus:ring-accent focus:border-transparent bg-bg-primary text-text-primary"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-white transition-colors rounded-lg bg-accent hover:bg-accent/90"
          >
            Search
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={handleSuggested}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
            activeTab === "suggested"
              ? "border-accent text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Suggested Companies
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors ${
            activeTab === "search"
              ? "border-accent text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Search Results
        </button>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-accent"></div>
        </div>
      ) : currentCompanies && currentCompanies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentCompanies.map((company) => (
            <div
              key={company._id}
              className="p-6 transition-shadow border rounded-lg bg-bg-primary border-border hover:shadow-lg"
            >
              {/* Company Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={company.logo || "/default-avatar.png"}
                  alt={company.name}
                  className="object-cover w-16 h-16 rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/company/${company._id}`}
                    className="block text-lg font-semibold truncate transition-colors text-text-primary hover:text-accent"
                  >
                    {company.name}
                  </Link>
                  <p className="text-sm truncate text-text-secondary">
                    {company.industry}
                  </p>
                </div>
              </div>

              {/* Company Info */}
              <div className="mb-4 space-y-2">
                {company.location && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.employeeCount && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Users className="w-4 h-4" />
                    <span>{company.employeeCount} employees</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Briefcase className="w-4 h-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              {company.description && (
                <p className="mb-4 text-sm text-text-secondary line-clamp-3">
                  {company.description}
                </p>
              )}

              {/* Followers Count */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-secondary">
                  {company.followers?.length || 0} followers
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/company/${company._id}`}
                  className="flex-1 px-4 py-2 text-center transition-colors border rounded-lg border-border text-text-primary hover:bg-bg-secondary"
                >
                  View Profile
                </Link>
                {company.followers?.includes(user?.id) ? (
                  <button
                    onClick={() => handleUnfollow(company._id)}
                    className="px-4 py-2 transition-colors border rounded-lg border-border text-text-primary hover:bg-bg-secondary"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(company._id)}
                    className="px-4 py-2 text-white transition-colors rounded-lg bg-accent hover:bg-accent/90"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <h3 className="mb-2 text-lg font-medium text-text-primary">
            {activeTab === "search" ? "No companies found" : "No suggested companies"}
          </h3>
          <p className="text-text-secondary">
            {activeTab === "search"
              ? "Try adjusting your search terms"
              : "Companies will be suggested based on your profile and connections"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Companies;
