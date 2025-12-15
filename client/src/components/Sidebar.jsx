import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Sidebar = ({ sideBarOpen, setSideBarOpen, isMobile }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.value);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  const fullName = typeof user?.full_name === "string" ? user.full_name : "User";
  const username = typeof user?.username === "string" ? user.username : "unknown";
  const profilePic = user?.profile_picture && typeof user.profile_picture === "string"
    ? user.profile_picture
    : assets.sample_profile;

  return (
    <motion.div
      className={`${isCollapsed ? 'w-16' : 'w-64 min-w-[256px]'} glass-card flex flex-col justify-between items-center ${isMobile ? 'absolute' : 'relative'} top-0 bottom-0 z-20 mobile-fix border-r border-glass-border transition-all duration-300`}
      initial={false}
      animate={{
        x: sideBarOpen ? 0 : isMobile ? -256 : 0,
        boxShadow: sideBarOpen ? "var(--shadow)" : "none",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Top Section */}
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {!isCollapsed && (
              <>
                <motion.img
                  onClick={() => navigate("/")}
                  src={assets.logo}
                  alt="App Logo"
                  className="w-24 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.div
                  className="ml-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5 text-accent animate-glow" />
                </motion.div>
              </>
            )}
            {isCollapsed && (
              <motion.img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt="App Logo"
                className="w-8 h-8 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            )}
          </motion.div>

          {/* Collapse Toggle Button */}
          {!isMobile && (
            <motion.button
              onClick={toggleCollapse}
              className="p-2 transition-all duration-200 rounded-lg glass-button hover:bg-glass-bg focus-ring"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-text-secondary" />
              )}
            </motion.button>
          )}
        </div>

        {!isCollapsed && (
          <motion.div
            className="w-full h-px mb-6 bg-gradient-to-r from-transparent via-border to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}

        {/* Menu Items */}
        <MenuItems setSideBarOpen={setSideBarOpen} isCollapsed={isCollapsed} />

        {/* Create Post Button */}
        <motion.div
          className={`mt-6 ${isCollapsed ? 'mx-2' : 'mx-4'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/create-post"
            className={`modern-button w-full flex items-center justify-center ${isCollapsed ? 'gap-0' : 'gap-3'} py-4 text-white font-semibold touch-manipulation min-h-[48px] focus-ring`}
            title={isCollapsed ? "Create Post" : undefined}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CirclePlus className="w-5 h-5" />
            </motion.div>
            {!isCollapsed && <span>Create Post</span>}
          </Link>
        </motion.div>
      </div>

      {/* Bottom Section (User + Logout) */}
      <motion.div
        className="w-full p-4 border-t border-glass-border"
        whileHover={{ backgroundColor: "var(--glass-bg)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          {/* User info */}
          <motion.div
            className="flex items-center flex-1 gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                src={profilePic}
                alt="Profile"
                className="object-cover w-12 h-12 border-2 rounded-full border-glass-border"
                onError={(e) => { e.target.onerror = null; e.target.src = assets.sample_profile; }}
              />
              <motion.div
                className="absolute w-4 h-4 border-2 rounded-full -bottom-1 -right-1 bg-success border-bg-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold truncate text-text-primary">
                {fullName}
              </h1>
              <p className="text-xs truncate text-text-secondary">
                @{username}
              </p>
            </div>
          </motion.div>

          {/* Logout button */}
          <motion.button
            onClick={handleLogout}
            className="p-2 transition-all duration-200 rounded-lg glass-button hover:bg-error/20 focus-ring"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <LogOut className="w-5 h-5 transition-colors text-text-secondary hover:text-error" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
