import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Attach access token — refresh proactively if it's expired
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");

  if (token) {
    const { exp } = jwtDecode(token);
    const isExpired = Date.now() >= exp * 1000;

    if (isExpired) {
      // Refresh before sending the request
      const { data } = await axios.post(
        "http://localhost:8080/api/refresh",
        {},
        { withCredentials: true },
      );
      token = data.accessToken;
      localStorage.setItem("accessToken", token);
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If access token expired, auto-refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          "http://localhost:8080/api/refresh",
          {},
          { withCredentials: true },
        );
        localStorage.setItem("accessToken", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original); // retry the failed request
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
