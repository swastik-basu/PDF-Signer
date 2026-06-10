package com.signpdf.service.interfaces;

import com.signpdf.dto.request.PlaceSignatureRequest;
import com.signpdf.dto.response.SignaturePlacementResponse;

import java.util.List;

public interface SignaturePlacementService {

	SignaturePlacementResponse placeSignature(PlaceSignatureRequest request);

	List<SignaturePlacementResponse> getDocumentPlacements(Long documentId);

	void removePlacement(Long placementId);
}