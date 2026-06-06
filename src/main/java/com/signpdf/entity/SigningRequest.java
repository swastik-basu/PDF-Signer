package com.signpdf.entity;
import com.signpdf.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Signing_Request")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SigningRequest{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	String signerEmail;

	String token;

	LocalDateTime expiresAt;
	
	@Enumerated(EnumType.STRING)
	SigningRequestStatus status;

	LocalDateTime createdAt;
	
	@ManyToOne
	@JoinColumn(name = "document_id")
	private Document document;
}