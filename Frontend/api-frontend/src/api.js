import axios from "axios";

const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const API_BASE_URL = isLocalhost
  ? process.env.REACT_APP_API_URL || "http://localhost:5050/api"
  : process.env.REACT_APP_API_URL || "https://secureauth-backend-4grz.onrender.com/api";

const REFRESH_URL = `${API_BASE_URL.replace(/\/api$/, "")}/api/users/refresh`;

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(` Error ${error.response?.status} on ${originalRequest?.url}`);

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        console.log(" Refreshing token...");

        const res = await axios.post(REFRESH_URL, { refreshToken });

        console.log(" Token refreshed!");

        localStorage.setItem("accessToken", res.data.accessToken);

        return API(originalRequest);
      } catch (refreshError) {
        console.error(" Refresh failed - Logging out");
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
