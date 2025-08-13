// lib/api.ts
import axios from "axios";
import { getToken } from "@/utils/token";

const api = axios.create({
  baseURL: "http://192.168.1.174:5106/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
