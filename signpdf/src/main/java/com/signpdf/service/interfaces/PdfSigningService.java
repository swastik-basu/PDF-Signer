package com.signpdf.service.interfaces;

import org.springframework.http.ResponseEntity;

import com.signpdf.dto.response.SignedDocumentResponse;

public interface PdfSigningService {

	SignedDocumentResponse signDocument(Long documentId);

	ResponseEntity<byte[]> downloadSignedPdf(Long signedDocumentId);
}