// import axios from "axios";

// // ✅ Vite-safe version (uses import.meta.env)
// // Automatically uses .env backend URL or defaults to localhost:5001
// // For mobile access, use your computer's IP: 10.255.66.225
// const baseURL = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api"}`;


// // ✅ Axios instance with credentials
// const api = axios.create({
//   baseURL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Automatically attach JWT token (if logged in)
// api.interceptors.request.use(
//   (config) => {
//     const storedUser =
//       localStorage.getItem("user") || sessionStorage.getItem("user");

//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         if (user?.token) {
//           config.headers.Authorization = `Bearer ${user.token}`;
//         }
//       } catch (err) {
//         console.warn("⚠️ Invalid user token in storage:", err.message);
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Global error interceptor (shows backend messages)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const msg =
//       error?.response?.data?.message ||
//       error?.message ||
//       "Network or server error";

//     console.error("❌ API Error:", msg);
//     return Promise.reject(error);
//   }
// );

// export { baseURL as BASE_URL };
// export default api;

import axios from "axios";

// ✅ Vite-safe version (uses import.meta.env)
// Use relative URL to leverage Vite proxy
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api" ;


// ✅ Axios instance with credentials
const api = axios.create({
  baseURL,
  withCredentials: true,
  // Remove default Content-Type to let browser set it for FormData
});

// ✅ Automatically attach JWT token (if logged in)
api.interceptors.request.use(
  (config) => {
    let token = null;

    // First try to get from user object
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.token) {
          token = user.token;
        }
      } catch (err) {
        console.warn("⚠️ Invalid user token in storage:", err.message);
      }
    }

    // If not found in user object, try separate token storage
    if (!token) {
      token = localStorage.getItem("token");
    }

    // 🚫 LOGIN & REGISTER pe token mat bhejo
    if (
      token &&
      !config.url.includes("/user/login") &&
      !config.url.includes("/user/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
      // debug: confirm token attached
      console.debug("[api] attaching token:", token?.slice ? token.slice(0, 10) + "..." : token);
    } else {
      console.debug("[api] no token found for request:", config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error interceptor (shows backend messages)
// On 401, clear local storage and redirect to login to avoid repeated retries
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Network or server error";

    console.error("❌ API Error:", msg);

    if (status === 401) {
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } catch (e) {
        /* ignore */
      }

      // Removed automatic redirect to avoid immediate nav back to login
      // Optionally emit an event other parts of the app can listen to:
      try {
        window.dispatchEvent(new CustomEvent("auth:unauthorized", { detail: { message: msg } }));
      } catch (e) {
        /* ignore */
      }
    }

    return Promise.reject(error);
  }
);

export { baseURL as BASE_URL };
export default api;
