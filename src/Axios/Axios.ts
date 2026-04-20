import axios from "axios";

// ✅ Create axios instance
const instance = axios.create({
  baseURL: "http://localhost:8081",
});

/* ================= REQUEST INTERCEPTOR ================= */
instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token setup failed:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Handle unauthorized (token expired)
    if (error.response?.status === 401) {
      console.log("Session expired. Clearing auth data...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Remove from axios defaults
      delete axios.defaults.headers.common["Authorization"];

      // Let the UserContext handle the redirect instead of forcing it here
      // This prevents multiple redirects and page refreshes
    }

    return Promise.reject(error);
  }
);

export default instance;