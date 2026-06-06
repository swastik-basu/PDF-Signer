package com.signpdf.entity;
import com.signpdf.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Signature_Placement")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SignaturePlacement{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	Integer pageNumber;

	Double xCoordinate;

	Double yCoordinate;

	Double width;

	Double height;

	Double rotation;
	
	@Enumerated(EnumType.STRING)
	SignaturePlacementStatus status;

	LocalDateTime createdAt;
	
	@ManyToOne
	@JoinColumn(name = "document_id")
	private Document document;
	
	@ManyToOne
	@JoinColumn(name = "signature_template_id")
	private SignatureTemplates signatureTemplate;
}