import axiosClient from "./axiosClient";

// POST /api/signatures (multipart/form-data: signatureName, type, image)
// "image" is a Blob/File -- e.g. a PNG exported from the signature canvas.
export const uploadSignature = ({ signatureName, type, image }) => {
  const formData = new FormData();
  formData.append("signatureName", signatureName);
  formData.append("type", type);
  formData.append("image", image);
  return axiosClient.post("/api/signatures", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET /api/signatures
export const getMySignatures = () => axiosClient.get("/api/signatures");

// GET /api/signatures/{id}
export const getSignatureById = (id) => axiosClient.get(`/api/signatures/${id}`);
