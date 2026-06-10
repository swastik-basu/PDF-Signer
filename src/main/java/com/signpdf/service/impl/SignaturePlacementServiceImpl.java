package com.signpdf.service.impl;

import com.signpdf.dto.request.PlaceSignatureRequest;
import com.signpdf.dto.response.SignaturePlacementResponse;

import com.signpdf.entity.Document;
import com.signpdf.entity.SignaturePlacement;
import com.signpdf.entity.SignatureTemplates;
import com.signpdf.entity.User;

import com.signpdf.enums.SignaturePlacementStatus;

import com.signpdf.repository.DocumentRepository;
import com.signpdf.repository.SignaturePlacementRepository;
import com.signpdf.repository.SignatureTemplatesRepository;
import com.signpdf.repository.UserRepository;

import com.signpdf.service.interfaces.SignaturePlacementService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SignaturePlacementServiceImpl implements SignaturePlacementService {

	private final SignaturePlacementRepository signaturePlacementRepository;

	private final SignatureTemplatesRepository signatureTemplateRepository;

	private final DocumentRepository documentRepository;

	private final UserRepository userRepository;

	@Override
	public SignaturePlacementResponse placeSignature(PlaceSignatureRequest request) {

		User currentUser = getCurrentUser();

		Document document = documentRepository.findByIdAndOwner(request.getDocumentId(), currentUser)
				.orElseThrow(() -> new RuntimeException("Document not found"));

		SignatureTemplates signatureTemplate = signatureTemplateRepository
				.findByIdAndOwner(request.getSignatureTemplateId(), currentUser)
				.orElseThrow(() -> new RuntimeException("Signature not found"));

		SignaturePlacement placement = SignaturePlacement.builder().document(document)
				.signatureTemplate(signatureTemplate).pageNumber(request.getPageNumber())
				.xCoordinate(request.getXCoordinate()).yCoordinate(request.getYCoordinate()).width(request.getWidth())
				.height(request.getHeight()).rotation(request.getRotation()).status(SignaturePlacementStatus.PLACED)
				.createdAt(LocalDateTime.now()).build();

		SignaturePlacement saved = signaturePlacementRepository.save(placement);

		return mapToResponse(saved);
	}

	@Override
	public List<SignaturePlacementResponse> getDocumentPlacements(Long documentId) {

		User currentUser = getCurrentUser();

		Document document = documentRepository.findByIdAndOwner(documentId, currentUser)
				.orElseThrow(() -> new RuntimeException("Document not found"));

		return signaturePlacementRepository.findByDocument(document).stream().map(this::mapToResponse).toList();
	}

	@Override
	public void removePlacement(Long placementId) {

		SignaturePlacement placement = signaturePlacementRepository.findById(placementId)
				.orElseThrow(() -> new RuntimeException("Placement not found"));

		signaturePlacementRepository.delete(placement);
	}

	private User getCurrentUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	}

	private SignaturePlacementResponse mapToResponse(SignaturePlacement placement) {

		return new SignaturePlacementResponse(placement.getId(), placement.getDocument().getId(),
				placement.getSignatureTemplate().getId(), placement.getPageNumber(), placement.getXCoordinate(),
				placement.getYCoordinate(), placement.getWidth(), placement.getHeight(), placement.getRotation(),
				placement.getStatus(), placement.getCreatedAt());
	}
}