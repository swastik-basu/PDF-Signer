import axiosClient from "./axiosClient";

// GET /api/audit-logs -- optional, only present if the backend implements it
export const getAuditLogs = () => axiosClient.get("/api/audit-logs");
