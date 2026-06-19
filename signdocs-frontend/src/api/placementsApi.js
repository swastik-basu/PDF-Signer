import axiosClient from "./axiosClient";

// POST /api/placements
// body: { documentId, signatureTemplateId, pageNumber, xCoordinate,
//         yCoordinate, width, height, rotation }
export const createPlacement = (payload) =>
  axiosClient.post("/api/placements", payload);

// GET /api/placements/document/{documentId}
export const getPlacementsByDocument = (documentId) =>
  axiosClient.get(`/api/placements/document/${documentId}`);
