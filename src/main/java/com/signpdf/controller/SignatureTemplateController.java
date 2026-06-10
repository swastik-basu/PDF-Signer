package com.signpdf.controller;

import com.signpdf.dto.request.CreateSignatureTemplateRequest;
import com.signpdf.dto.response.SignatureTemplateResponse;

import com.signpdf.service.interfaces.SignatureTemplateService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
public class SignatureTemplateController {

	private final SignatureTemplateService signatureTemplateService;

	@PostMapping
	public ResponseEntity<SignatureTemplateResponse> createSignature(@ModelAttribute @Valid CreateSignatureTemplateRequest request) {

		return ResponseEntity.ok(signatureTemplateService.createSignature(request));
	}

	@GetMapping
	public ResponseEntity<List<SignatureTemplateResponse>> getMySignatures() {

		return ResponseEntity.ok(signatureTemplateService.getMySignatures());
	}

	@GetMapping("/{id}")
	public ResponseEntity<SignatureTemplateResponse> getSignatureById(@PathVariable Long id) {

		return ResponseEntity.ok(signatureTemplateService.getSignatureById(id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteSignature(@PathVariable Long id) {

		signatureTemplateService.deleteSignature(id);

		return ResponseEntity.ok("Signature deleted successfully");
	}
}