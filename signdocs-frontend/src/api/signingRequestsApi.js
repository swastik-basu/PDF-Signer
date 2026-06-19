import axiosClient from "./axiosClient";

// POST /api/signing-requests
// body: { documentId, signerEmail }
export const createSigningRequest = (payload) =>
  axiosClient.post("/api/signing-requests", payload);

// GET /api/signing-requests
export const getMySigningRequests = () =>
  axiosClient.get("/api/signing-requests");

// GET /api/signing-requests/token/{token}  -- PUBLIC, no JWT
export const validateSigningToken = (token) =>
  axiosClient.get(`/api/signing-requests/token/${token}`, {
    skipAuth: true,
  });

// POST /api/signing-requests/complete/{token} -- PUBLIC, no JWT
export const completeSigningRequest = (token, payload) =>
  axiosClient.post(`/api/signing-requests/complete/${token}`, payload, {
    skipAuth: true,
  });
