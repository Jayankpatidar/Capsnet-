import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import NotificationBell from "../components/NotificationBell";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640) setSideBarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex w-full min-h-screen overflow-hidden bg-gradient-secondary">

      {/* ============== MOBILE OVERLAY ================= */}
      <AnimatePresence>
        {sideBarOpen && isMobile && (
          <motion.div
            className="fixed inset-0 z-30 bg-black bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSideBarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ============== SIDEBAR ================= */}
      <Sidebar
        sideBarOpen={sideBarOpen}
        setSideBarOpen={setSideBarOpen}
        isMobile={isMobile}
      />

      {/* ============== MAIN CONTENT AREA ================= */}
      <div className="relative flex flex-col flex-1 min-h-0">

        {/* Notification Bell */}
        <div className="absolute z-20 top-4 right-16">
          <NotificationBell />
        </div>

        {/* Page Content (Outlet) */}
        <motion.div
          className="flex-1 min-h-0 px-2 pt-16 overflow-y-auto sm:px-4 md:px-6 md:pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>

        {/* Chatbot */}
        <Chatbot />

        {/* Footer */}
        <Footer />
      </div>

      {/* ============== MOBILE TOGGLE BUTTON ================= */}
      {isMobile && (
        <motion.button
          type="button"
          className="fixed z-50 flex items-center justify-center w-12 h-12 shadow-lg top-4 right-4 rounded-xl glass-button text-text-primary"
          onClick={() => setSideBarOpen(!sideBarOpen)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sideBarOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      )}
    </div>
  );
};

export default Layout;
