import axiosClient from "./axiosClient";

// POST /api/documents/upload  (multipart/form-data, field name "file")
export const uploadDocument = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("/api/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

// GET /api/documents
export const getMyDocuments = () => axiosClient.get("/api/documents");

// GET /api/documents/{id}
export const getDocumentById = (id) => axiosClient.get(`/api/documents/${id}`);

// GET /api/documents/download/{id} -- returns the raw PDF as a blob
export const downloadOriginalPdf = (id) =>
  axiosClient.get(`/api/documents/${id}/place`, { responseType: "blob" });
