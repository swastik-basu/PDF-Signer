import axiosClient from "./axiosClient";

// POST /api/pdf/sign/{documentId} -- generates the signed PDF server-side
export const generateSignedPdf = (documentId) =>
  axiosClient.post(`/api/pdf/sign/${documentId}`);

// GET /api/pdf/download/{signedDocumentId} -- returns the signed PDF as a blob
export const downloadSignedPdf = (signedDocumentId) =>
  axiosClient.get(`/api/pdf/download/${signedDocumentId}`, {
    responseType: "blob",
  });
