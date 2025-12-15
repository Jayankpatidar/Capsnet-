import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ChatBox from "./pages/ChatBox.jsx";
import Connections from "./pages/Connections";
import CreatePost from "./pages/CreatePost";
import Discover from "./pages/Discover";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile";
import Messages from "./pages/Message";
import Feed from "./pages/Feed";
import Jobs from "./pages/Jobs";
import JobsHome from "./pages/JobsHome";
import Settings from "./pages/Settings";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import Reels from "./pages/Reels";
import CreateReel from "./pages/CreateReel";
import Notifications from "./pages/Notifications";
import SkillConnect from "./pages/SkillConnect";
import AdminDashboard from "./pages/AdminDashboard";
import AIDashboard from "./pages/AIDashboard";
import CompanyPage from "./pages/CompanyPage";
import CreateCompany from "./pages/CreateCompany";
import Companies from "./pages/Companies";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Search from "./pages/Search";

import Loading from "./components/Loading";
import Notification from "./components/Notification.jsx";


import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setUser as setUserAction } from "./features/users/userSlice.js";
import { fetchConnections } from "./features/connections/connectionsSlice.js";
import { addMessages } from "./features/messages/messagesSlice.js";

import { Moon, Sun } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);


  const location = useLocation();

  // Set theme on first load
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Restore user from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("user"));
      if (saved && saved.token) {
        dispatch(setUserAction(saved));
      } else {
        // ensure store is cleared if nothing valid in storage
        dispatch(setUserAction(null));
      }
    } catch {
      console.log("Invalid user in localStorage");
      dispatch(setUserAction(null));
    }
    setLoading(false);
  }, [dispatch]);

  // Listen to storage changes (sync between tabs / updates)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          const val = JSON.parse(e.newValue);
          if (val && val.token) {
            dispatch(setUserAction(val));
          } else {
            dispatch(setUserAction(null));
          }
        } catch {
          dispatch(setUserAction(null));
        }
      }
    };
    window.addEventListener("storage", onStorage);

    // Listen for axios auth event (emitted on 401)
    const onUnauthorized = (ev) => {
      const msg = ev?.detail?.message || "Session expired";
      toast.error(msg);
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch {}
      dispatch(setUserAction(null));
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:unauthorized", onUnauthorized);
    };
  }, [dispatch]);

  // Fetch user + connections
  useEffect(() => {
    if (!user?.token) return;

    const load = async () => {
      try {
        await dispatch(fetchUser(user.token)).unwrap();
        await dispatch(fetchConnections()).unwrap();
      } catch {
        localStorage.removeItem("user");
      }
    };

    load();
  }, [user, dispatch]);

  // Real-time SSE messages
  useEffect(() => {
    if (!user?._id) return;

    const eventSource = new EventSource(`${BASE_URL}/api/message/${user._id}`);

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const currentPath = location.pathname;
      const targetPath = `/message/${message.from_user_id._id}`;

      if (currentPath.startsWith(targetPath)) {
        dispatch(addMessages(message));
      } else {
        toast.custom((t) => <Notification t={t} message={message} />, {
          position: "bottom-right",
        });
      }
    };

    return () => eventSource.close();
  }, [user, location, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loading height="100vh" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          },
        }}
      />

      {/* THEME SWITCHER */}
      {user && (
        <button
          onClick={toggleTheme}
          className="fixed z-50 p-3 transition-all bg-white border rounded-full shadow-lg dark:bg-slate-800 dark:border-slate-700 top-4 left-4"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-600" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </button>
      )}

      {/* ------------ ROUTES START ------------ */}
      <Routes>
        {/* explicit login route */}
        <Route
          path="/login"
          element={!user ? <Login setUser={(u) => dispatch(setUserAction(u))} /> : <Navigate to="/" replace />}
        />

        {/* Protected app routes under wildcard; redirect to /login if not authenticated */}
        <Route
          path="/*"
          element={
            user ? (
              <Layout user={user} setUser={(u) => dispatch(setUserAction(u))} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Feed />} />
          <Route path="message" element={<Messages />} />
          <Route path="message/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="jobs-home" element={<JobsHome />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="reels" element={<Reels />} />
          <Route path="create-reel" element={<CreateReel />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="professional-dashboard" element={<ProfessionalDashboard />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="skill-connect" element={<SkillConnect />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="ai-dashboard" element={<AIDashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="company/:companyId" element={<CompanyPage />} />
          <Route path="company/create" element={<CreateCompany />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
      {/* ------------ ROUTES END ------------ */}


    </>
  );
};

export default App;

