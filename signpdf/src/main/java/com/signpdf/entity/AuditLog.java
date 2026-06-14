package com.signpdf.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.signpdf.enums.AuditAction;

@Entity
@Table(name = "Audit_Logs ")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AuditLog{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@Enumerated(EnumType.STRING)
	AuditAction action;

	String ipAddress;

	String description;

	LocalDateTime timestamp;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "document_id")
	private Document document;
}