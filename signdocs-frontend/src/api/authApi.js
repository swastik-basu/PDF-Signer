import axiosClient from "./axiosClient";

// POST /api/auth/register
// body: { name, email, password }
// response: { token, userId, name, email, role }
export const register = (payload) =>
  axiosClient.post("/api/auth/register", payload);

// POST /api/auth/login
// body: { email, password }
// response: { token, userId, name, email, role }
export const login = (payload) =>
  axiosClient.post("/api/auth/login", payload);
