package com.signpdf.service.impl;

import com.signpdf.dto.response.SignedDocumentResponse;

import com.signpdf.entity.*;

import com.signpdf.enums.DocumentStatus;

import com.signpdf.repository.*;

import com.signpdf.service.interfaces.PdfSigningService;

import com.signpdf.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfSigningServiceImpl implements PdfSigningService {

	private final DocumentRepository documentRepository;

	private final SignaturePlacementRepository signaturePlacementRepository;

	private final SignedDocumentRepository signedDocumentRepository;

	private final SecurityUtils securityUtils;

	@Override
	public SignedDocumentResponse signDocument(Long documentId) {

		try {

			User currentUser = securityUtils.getCurrentUser();

			Document document = documentRepository.findByIdAndOwner(documentId, currentUser)
					.orElseThrow(() -> new RuntimeException("Document not found"));
			List<SignaturePlacement> placements = signaturePlacementRepository.findByDocument(document);

			PDDocument pdf = Loader.loadPDF(document.getPdfData());

			for (SignaturePlacement placement : placements) {

				PDPage page = pdf.getPage(placement.getPageNumber() - 1);

				PDImageXObject image = PDImageXObject.createFromByteArray(pdf,
						placement.getSignatureTemplate().getSignatureImage(), "signature");

				PDPageContentStream contentStream = new PDPageContentStream(pdf, page,
						PDPageContentStream.AppendMode.APPEND, true);

				contentStream.drawImage(image, placement.getXCoordinate().floatValue(),
						placement.getYCoordinate().floatValue(), placement.getWidth().floatValue(),
						placement.getHeight().floatValue());

				contentStream.close();
			}

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

			pdf.save(outputStream);

			pdf.close();

			SignedDocument signedDocument = SignedDocument.builder().document(document)
					.signedPdfData(outputStream.toByteArray()).generatedAt(LocalDateTime.now()).build();

			SignedDocument saved = signedDocumentRepository.save(signedDocument);

			document.setStatus(DocumentStatus.SIGNED);

			documentRepository.save(document);

			return new SignedDocumentResponse(saved.getId(), document.getId(), saved.getGeneratedAt(),
					"PDF signed successfully");

		} catch (Exception e) {

			throw new RuntimeException("Failed to sign PDF", e);
		}
	}

	@Override
	public ResponseEntity<byte[]> downloadSignedPdf(Long signedDocumentId) {

		User currentUser = securityUtils.getCurrentUser();

		SignedDocument signedDocument = signedDocumentRepository.findByIdAndDocument_Owner(signedDocumentId, currentUser)
				.orElseThrow(() -> new RuntimeException("Signed document not found"));

		return ResponseEntity.ok()

				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=signed-document.pdf")

				.contentType(MediaType.APPLICATION_PDF)

				.body(signedDocument.getSignedPdfData());
	}
}