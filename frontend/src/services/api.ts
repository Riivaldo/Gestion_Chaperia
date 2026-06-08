import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Ajusta según tu puerto de NestJS
});

// Interceptor para adjuntar el token automáticamente si usas JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
