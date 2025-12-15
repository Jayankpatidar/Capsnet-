import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import toast from "react-hot-toast";
import { Mail, CheckCircle, AlertCircle, Loader } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail();
  }, [searchParams]);

  const verifyEmail = async () => {
    try {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      const response = await axios.get(`/user/verify-email/${token}`);

      if (response.data.success) {
        setStatus("success");
        setMessage("✅ Email verified successfully!");
        toast.success("Email verified! You can now login.");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        setStatus("error");
        setMessage(response.data.message || "Verification failed");
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
        "Invalid or expired verification link"
      );
      toast.error(
        error.response?.data?.message ||
        "Invalid or expired verification link"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {/* Verifying */}
        {status === "verifying" && (
          <>
            <Loader className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Email...
            </h1>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Try Again
              </button>
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900">
                Check your email
              </p>
              <p className="text-xs text-blue-700 mt-1">
                We sent a verification link to your college email. Click the link to activate your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
