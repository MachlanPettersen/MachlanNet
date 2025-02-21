import axios from "axios";

export const API_URL = "https://machlannetbackend.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for admin authentication
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token && config.url?.includes("delete")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
