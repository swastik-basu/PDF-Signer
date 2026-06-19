package com.signpdf.controller;

import com.signpdf.dto.request.PlaceSignatureRequest;
import com.signpdf.dto.response.SignaturePlacementResponse;

import com.signpdf.service.interfaces.SignaturePlacementService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placements")
@RequiredArgsConstructor
public class SignaturePlacementController {

	private final SignaturePlacementService signaturePlacementService;

	@PostMapping
	public ResponseEntity<SignaturePlacementResponse> placeSignature(

			@Valid @RequestBody PlaceSignatureRequest request) {

		return ResponseEntity.ok(signaturePlacementService.placeSignature(request));
	}

	@GetMapping("/document/{documentId}")
	public ResponseEntity<List<SignaturePlacementResponse>> getDocumentPlacements(@PathVariable Long documentId) {

		return ResponseEntity.ok(signaturePlacementService.getDocumentPlacements(documentId));
	}

	@DeleteMapping("/{placementId}")
	public ResponseEntity<String> removePlacement(@PathVariable Long placementId) {

		signaturePlacementService.removePlacement(placementId);

		return ResponseEntity.ok("Placement removed successfully");
	}
}