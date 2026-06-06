package com.signpdf.entity;
import com.signpdf.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Document")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Document{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	String fileName;

	String contentType;

	Long fileSize;
	
	@Lob
	byte[] pdfData;
	
	@Enumerated(EnumType.STRING)
	DocumentStatus status;

	LocalDateTime createdAt;

	LocalDateTime updatedAt;
	
	@ManyToOne
	@JoinColumn(name = "owner_id")
	private User owner;
	
	@OneToMany(mappedBy = "document")
	private List<SignaturePlacement> signaturePlacements;
	
	@OneToMany(mappedBy = "document")
	private List<SigningRequest> signingRequests;
	
	@OneToMany(mappedBy = "document")
	private List<AuditLog> auditLogs;
	
	@OneToOne(mappedBy = "document")
	private SignedDocument signedDocument;
}