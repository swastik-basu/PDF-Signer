package com.signpdf.controller;

import com.signpdf.dto.response.DocumentResponse;
import com.signpdf.service.interfaces.DocumentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

	private final DocumentService documentService;

	@PostMapping("/upload")
	public ResponseEntity<DocumentResponse> uploadDocument(@RequestParam("file") MultipartFile file) {

		return ResponseEntity.ok(documentService.uploadDocument(file));
	}

	@GetMapping
	public ResponseEntity<List<DocumentResponse>> getMyDocuments() {

		return ResponseEntity.ok(documentService.getMyDocuments());
	}

	@GetMapping("/{id}")
	public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {

		return ResponseEntity.ok(documentService.getDocumentById(id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteDocument(@PathVariable Long id) {

		documentService.deleteDocument(id);

		return ResponseEntity.ok("Document deleted successfully");
	}

	@GetMapping("/{id}/place")
	public ResponseEntity<byte[]> getDocumentContent(@PathVariable Long id) {

		byte[] pdfData = documentService.getDocumentContent(id);

		return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_PDF).body(pdfData);
	}
}