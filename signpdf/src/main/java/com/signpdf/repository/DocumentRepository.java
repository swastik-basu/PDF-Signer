package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {
	List<Document> findByOwner(User owner);

	Optional<Document> findByIdAndOwner(Long id, User owner);

}