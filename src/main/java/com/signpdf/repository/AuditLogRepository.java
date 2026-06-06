package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long>{
	List<AuditLog> findByDocument(Document document);

	List<AuditLog> findByUser(User user);
}