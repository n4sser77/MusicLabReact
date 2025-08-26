// lib/api.ts
import axios from "axios";
import { getToken } from "@/utils/token";

const api = axios.create({
  // baseURL: "http://localhost:5106/api",
  baseURL: import.meta.env.VITE_API_ENDPOINT_DEV + "/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
