package com.signpdf.entity;
import com.signpdf.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import java.util.*;
@Entity
@Table(name = "Signed_Templates")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SignatureTemplates{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	String signatureName;
	
	@Enumerated(EnumType.STRING)
	SignatureType type;
	
	@Lob
	byte[] signatureImage;

	LocalDateTime createdAt;
	
	@ManyToOne
	@JoinColumn(name = "owner_id")
	private User owner;
	
	@OneToMany(mappedBy = "signatureTemplate")
	private List<SignaturePlacement> signaturePlacements;
}