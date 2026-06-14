package com.signpdf.controller;

import com.signpdf.dto.request.CreateSigningRequestRequest;
import com.signpdf.dto.response.SigningRequestResponse;
import com.signpdf.service.interfaces.SigningRequestService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signing-requests")
@RequiredArgsConstructor
public class SigningRequestController {

	private final SigningRequestService signingRequestService;

	@PostMapping
	public ResponseEntity<SigningRequestResponse> createRequest(
			@Valid @RequestBody CreateSigningRequestRequest request) {

		return ResponseEntity.ok(signingRequestService.createRequest(request));
	}

	@GetMapping
	public ResponseEntity<List<SigningRequestResponse>> getMyRequests() {

		return ResponseEntity.ok(signingRequestService.getMyRequests());
	}

	@GetMapping("/token/{token}")
	public ResponseEntity<SigningRequestResponse> validateToken(@PathVariable String token) {

		return ResponseEntity.ok(signingRequestService.validateToken(token));
	}

	@PostMapping("/complete/{token}")
	public ResponseEntity<String> completeSigning(@PathVariable String token) {

		return ResponseEntity.ok(signingRequestService.completeSigning(token));
	}
}