package com.signpdf.service.impl;

import com.signpdf.dto.response.DocumentResponse;
import com.signpdf.entity.Document;
import com.signpdf.entity.User;
import com.signpdf.enums.DocumentStatus;
import com.signpdf.repository.DocumentRepository;
import com.signpdf.repository.UserRepository;
import com.signpdf.service.interfaces.DocumentService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

	private final DocumentRepository documentRepository;

	private final UserRepository userRepository;

	@Override
	public DocumentResponse uploadDocument(MultipartFile file) {

		if (file == null || file.isEmpty()) {
			throw new RuntimeException("File cannot be empty");
		}

		if (!"application/pdf".equals(file.getContentType())) {
			throw new RuntimeException("Only PDF files are allowed");
		}

		User currentUser = getCurrentUser();

		try {

			Document document = Document.builder().fileName(file.getOriginalFilename())
					.contentType(file.getContentType()).fileSize(file.getSize()).pdfData(file.getBytes())
					.status(DocumentStatus.DRAFT).owner(currentUser).createdAt(LocalDateTime.now())
					.updatedAt(LocalDateTime.now()).build();

			Document savedDocument = documentRepository.save(document);

			return mapToResponse(savedDocument);

		} catch (IOException e) {
			throw new RuntimeException("Failed to upload document", e);
		}
	}

	@Override
	public List<DocumentResponse> getMyDocuments() {

		User currentUser = getCurrentUser();

		return documentRepository.findByOwner(currentUser).stream().map(this::mapToResponse).toList();
	}

	@Override
	public DocumentResponse getDocumentById(Long documentId) {

		User currentUser = getCurrentUser();

		Document document = documentRepository.findByIdAndOwner(documentId, currentUser)
				.orElseThrow(() -> new RuntimeException("Document not found"));

		return mapToResponse(document);
	}

	@Override
	public void deleteDocument(Long documentId) {

		User currentUser = getCurrentUser();

		Document document = documentRepository.findByIdAndOwner(documentId, currentUser)
				.orElseThrow(() -> new RuntimeException("Document not found"));

		documentRepository.delete(document);
	}

	private User getCurrentUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	}

	private DocumentResponse mapToResponse(Document document) {

		return new DocumentResponse(document.getId(), document.getFileName(), document.getFileSize(),
				document.getStatus(), document.getCreatedAt());
	}
}