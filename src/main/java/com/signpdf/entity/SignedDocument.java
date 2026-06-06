package com.signpdf.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Signed_Document")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SignedDocument{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@Lob
	byte[] signedPdfData;

	LocalDateTime generatedAt;
	
	@OneToOne
	@JoinColumn(name = "document_id")
	private Document document;
}