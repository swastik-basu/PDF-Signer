package com.signpdf.service.impl;

import com.signpdf.dto.request.CreateSigningRequestRequest;
import com.signpdf.dto.response.SigningRequestResponse;

import com.signpdf.entity.Document;
import com.signpdf.entity.SigningRequest;
import com.signpdf.entity.User;

import com.signpdf.enums.SigningRequestStatus;

import com.signpdf.repository.DocumentRepository;
import com.signpdf.repository.SigningRequestRepository;

import com.signpdf.security.SecurityUtils;
import com.signpdf.service.interfaces.EmailService;
import com.signpdf.service.interfaces.PdfSigningService;
import com.signpdf.service.interfaces.SigningRequestService;

import com.signpdf.util.TokenGenerator;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SigningRequestServiceImpl implements SigningRequestService {

	private final SigningRequestRepository signingRequestRepository;

	private final DocumentRepository documentRepository;

	private final SecurityUtils securityUtils;

	private final TokenGenerator tokenGenerator;

	private final PdfSigningService pdfSigningService;

	private final EmailService emailService;

	@Override
	public SigningRequestResponse createRequest(CreateSigningRequestRequest request) {

		User currentUser = securityUtils.getCurrentUser();

		Document document = documentRepository.findByIdAndOwner(request.getDocumentId(), currentUser)
				.orElseThrow(() -> new RuntimeException("Document not found"));

		SigningRequest signingRequest = SigningRequest.builder().document(document).requestedBy(currentUser)
				.signerEmail(request.getSignerEmail()).token(tokenGenerator.generateToken())
				.status(SigningRequestStatus.PENDING).createdAt(LocalDateTime.now())
				.expiresAt(LocalDateTime.now().plusDays(7)).build();

		SigningRequest saved = signingRequestRepository.save(signingRequest);
		emailService.sendSigningRequestEmail(saved.getSignerEmail(), saved.getToken());
		return mapToResponse(saved);
	}

	@Override
	public List<SigningRequestResponse> getMyRequests() {

		User currentUser = securityUtils.getCurrentUser();

		return signingRequestRepository.findByRequestedBy(currentUser).stream().map(this::mapToResponse).toList();
	}

	@Override
	public SigningRequestResponse validateToken(String token) {

		SigningRequest request = signingRequestRepository.findByToken(token)
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		if (request.getExpiresAt().isBefore(LocalDateTime.now())) {

			request.setStatus(SigningRequestStatus.EXPIRED);

			signingRequestRepository.save(request);

			throw new RuntimeException("Token expired");
		}

		return mapToResponse(request);
	}

	@Override
	public String completeSigning(String token) {

		SigningRequest request = signingRequestRepository.findByToken(token)
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		if (request.getExpiresAt().isBefore(LocalDateTime.now())) {

			request.setStatus(SigningRequestStatus.EXPIRED);

			signingRequestRepository.save(request);

			throw new RuntimeException("Token expired");
		}

		pdfSigningService.signDocument(request.getDocument().getId());

		request.setStatus(SigningRequestStatus.COMPLETED);

		signingRequestRepository.save(request);

		return "Document signed successfully";
	}

	private SigningRequestResponse mapToResponse(SigningRequest request) {

		return new SigningRequestResponse(request.getId(), request.getDocument().getId(), request.getSignerEmail(),
				request.getToken(), request.getStatus(), request.getExpiresAt());
	}
}