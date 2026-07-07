import axios from "axios";

const API = axios.create({
  baseURL: "https://secureauth-backend-4grz.onrender.com/api",
  timeout: 10000,
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

        const res = await axios.post(
          "https://secureauth-backend-4grz.onrender.com/api/users/refresh",
          { refreshToken },
        );

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
