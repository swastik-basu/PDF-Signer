package com.signpdf.service.impl;

import com.signpdf.dto.request.CreateSignatureTemplateRequest;
import com.signpdf.dto.response.SignatureTemplateResponse;

import com.signpdf.entity.SignatureTemplates;
import com.signpdf.entity.User;
import com.signpdf.enums.AuditAction;
import com.signpdf.exception.SignatureNotFoundException;
import com.signpdf.repository.SignatureTemplatesRepository;
import com.signpdf.repository.UserRepository;
import com.signpdf.service.interfaces.AuditService;
import com.signpdf.service.interfaces.SignatureTemplateService;
import com.signpdf.util.RequestUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SignatureTemplateServiceImpl implements SignatureTemplateService {

	private final SignatureTemplatesRepository signatureTemplatesRepository;

	private final UserRepository userRepository;

	private final AuditService auditService;
	
	private final RequestUtils requestUtils;

	@Override
	public SignatureTemplateResponse createSignature(CreateSignatureTemplateRequest request) {

		User currentUser = getCurrentUser();

		try {

			if (request.getImage() == null || request.getImage().isEmpty()) {

				throw new SignatureNotFoundException("Signature image is required");
			}

			SignatureTemplates signature = SignatureTemplates.builder().signatureName(request.getSignatureName())
					.type(request.getType()).signatureImage(request.getImage().getBytes())
					.createdAt(LocalDateTime.now()).owner(currentUser).build();

			SignatureTemplates saved = signatureTemplatesRepository.save(signature);

			auditService.log(AuditAction.CREATE_SIGNATURE, "Created signature: " + signature.getSignatureName(),
					currentUser, requestUtils.getClientIpAddress());

			return mapToResponse(saved);

		} catch (IOException e) {

			throw new RuntimeException("Failed to create signature", e);
		}
	}

	@Override
	public List<SignatureTemplateResponse> getMySignatures() {

		User currentUser = getCurrentUser();

		return signatureTemplatesRepository.findByOwner(currentUser).stream().map(this::mapToResponse).toList();
	}

	@Override
	public SignatureTemplateResponse getSignatureById(Long signatureId) {

		User currentUser = getCurrentUser();

		SignatureTemplates signature = signatureTemplatesRepository.findByIdAndOwner(signatureId, currentUser)
				.orElseThrow(() -> new SignatureNotFoundException("Signature not found"));

		return mapToResponse(signature);
	}

	@Override
	public void deleteSignature(Long signatureId) {

		User currentUser = getCurrentUser();

		SignatureTemplates signature = signatureTemplatesRepository.findByIdAndOwner(signatureId, currentUser)
				.orElseThrow(() -> new SignatureNotFoundException("Signature not found"));

		signatureTemplatesRepository.delete(signature);
	}

	private User getCurrentUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	}

	private SignatureTemplateResponse mapToResponse(SignatureTemplates signature) {

		return new SignatureTemplateResponse(signature.getId(), signature.getSignatureName(), signature.getType(),
				signature.getCreatedAt());
	}
}