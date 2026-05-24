import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) =>
  API.post("/auth/login", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const getMe = () => API.get("/auth/me");

// Analyze
export const analyzePosting = (data) => API.post("/analyze", data);

// Upload
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Reports
export const getReports = () => API.get("/reports/");
export const saveReport = (data) => API.post("/reports/", data);
export const deleteReport = (reportId) => API.delete(`/reports/${reportId}`);