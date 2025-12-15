import React from "react";
import { menuItemsData } from "../assets/assets.js";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const MenuItems = ({ setSideBarOpen, isCollapsed }) => {
  const user = useSelector((state) => state.user?.value);

  // ✅ Safe guard in case menuItemsData is missing or malformed
  if (!Array.isArray(menuItemsData) || menuItemsData.length === 0) {
    return (
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        No menu items available
      </p>
    );
  }

  return (
    <div className="px-6 space-y-1 font-medium text-gray-600 dark:text-gray-300">
      {menuItemsData.map(({ to, label, Icon, adminOnly }) => {
        // Skip admin-only items for non-admins
        if (adminOnly && user?.role !== "admin") return null;

        // ✅ Ensure Icon is a valid React component before rendering
        const SafeIcon =
          typeof Icon === "function" ? (
            <Icon className="w-5 h-5" />
          ) : (
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
          );

        // ✅ Ensure label is string or number
        const safeLabel =
          typeof label === "string" || typeof label === "number"
            ? label
            : "Menu";

        return (
          <motion.div
            key={to}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to={to}
              end={to === "/"}
              onClick={() => setSideBarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {SafeIcon}
              </motion.div>
              {!isCollapsed && <span className="font-medium">{safeLabel}</span>}
            </NavLink>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MenuItems;
