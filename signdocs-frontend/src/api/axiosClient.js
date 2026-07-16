import axios from "axios";

// Base URL comes from .env (VITE_API_BASE_URL). Falls back to localhost:8080
// to match the Spring Boot dev server.
const baseURL = "http://localhost:8080";

const axiosClient = axios.create({
  baseURL,
});

// Attach the JWT to every request automatically, except routes that the
// backend explicitly marks as public (token validation + completing a
// signing request don't require auth).
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isPublic = config.skipAuth === true;
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever returns 401 (expired/invalid token), clear local
// session state and bounce the user back to /login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
