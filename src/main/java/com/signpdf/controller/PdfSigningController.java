package com.signpdf.controller;

import com.signpdf.dto.response.SignedDocumentResponse;
import com.signpdf.service.interfaces.PdfSigningService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfSigningController {

	private final PdfSigningService pdfSigningService;

	@PostMapping("/sign/{documentId}")
	public ResponseEntity<SignedDocumentResponse> signDocument(@PathVariable Long documentId) {

		return ResponseEntity.ok(pdfSigningService.signDocument(documentId));
	}

	@GetMapping("/download/{signedDocumentId}")
	public ResponseEntity<byte[]> downloadSignedPdf(@PathVariable Long signedDocumentId) {

		return pdfSigningService.downloadSignedPdf(signedDocumentId);
	}
}