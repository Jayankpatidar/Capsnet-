import React, { useState } from "react";
import { Star, Eye, EyeOff } from "lucide-react";
import axios from "../api/axios.js";
import { useDispatch } from "react-redux";
import { setUser as setUserAction } from "../features/users/userSlice.js";
import { assets } from "../assets/assets.js";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isMedicapsEmail = (email) => email.toLowerCase().endsWith("@medicaps.ac.in");

      if (isSignUp) {
        if (!isMedicapsEmail(formData.email)) {
          setError("Only @medicaps.ac.in email IDs are allowed");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const response = await axios.post("/user/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          console.debug("[login] register response:", response.data);
          
          // Show verification message
          toast.success("Account created! 📧 Check your email for verification link");
          
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          
          // Switch to login mode
          setIsSignUp(false);
          
          // Show instruction
          setTimeout(() => {
            toast.custom((t) => (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-lg">
                <p className="text-blue-900 font-semibold">📨 Verify Your Email</p>
                <p className="text-blue-800 text-sm mt-1">Check your email for the verification link from capsnet</p>
              </div>
            ), { duration: 6000 });
          }, 500);
        }
      } else {
        if (!isMedicapsEmail(formData.email)) {
          setError("Only @medicaps.ac.in email IDs are allowed");
          setLoading(false);
          return;
        }
        const response = await axios.post("/user/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          console.debug("[login] login response:", response.data);
          const userData = {
            id: response.data.user._id,
            name: response.data.user.full_name,
            email: response.data.user.email,
            token: response.data.token,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", response.data.token);
          dispatch(setUserAction(userData));
          toast.success("Logged in");
          navigate("/", { replace: true }); // no reload
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      
      // Special handling for email verification error
      if (errorMsg.includes("verify")) {
        toast.error("📧 Please verify your email first!");
        toast.custom((t) => (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-lg">
            <p className="text-yellow-900 font-semibold">Email Not Verified</p>
            <p className="text-yellow-800 text-sm mt-1">Check your email for the verification link and click it to activate your account</p>
          </div>
        ), { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background image */}
      <img src={assets.bgImage} alt="background" className="bg-image" />

      {/* Left side */}
      <div className="left-side">
        <div className="logo-section">
          <img src={assets.logo} alt="Logo" className="logo" />
          <h1 className="title">capsnet</h1>
        </div>

        <div className="content">
          <div className="rating">
            <img src={assets.group_users} alt="users" className="group-users" />
            <div>
              <div className="stars">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="star" />
                  ))}
              </div>
              <p className="rating-text">Used by 12k+ developers</p>
            </div>
          </div>

          <h2 className="main-heading">
            More than just friends, <br /> truly connect
          </h2>
          <p className="sub-heading">
            Connect with the global community on capsnet.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="right-side">
        <div className="form-container">
          <h2 className="form-title">
            {isSignUp ? "Create Account" : "Welcome Back 👋"}
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            {isSignUp && (
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group password-group">
              <label className="label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
              >
                {showPassword ? (
                  <EyeOff className="eye-icon" />
                ) : (
                  <Eye className="eye-icon" />
                )}
              </button>
            </div>

            {isSignUp && (
              <div className="form-group password-group">
                <label className="label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="eye-button"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="eye-icon" />
                  ) : (
                    <Eye className="eye-icon" />
                  )}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="switch-link">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="switch-button"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
