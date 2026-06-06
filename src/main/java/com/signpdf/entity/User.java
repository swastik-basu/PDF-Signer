package com.signpdf.entity;
import com.signpdf.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	
	@Column(nullable = false)
	String name;
	
	@Column(nullable = false, unique = true)
	String email;
	
	@Column(nullable = false)
	String password;
	
	@Enumerated(EnumType.STRING)
	Role role;

	LocalDateTime createdAt;

	LocalDateTime updatedAt;
	
	@OneToMany(mappedBy = "owner")
	private List<Document> documents;

	@OneToMany(mappedBy = "owner")
	private List<SignatureTemplates> signatureTemplates;

	@OneToMany(mappedBy = "user")
	private List<AuditLog> auditLogs;
}