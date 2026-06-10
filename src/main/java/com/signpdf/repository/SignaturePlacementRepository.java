package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SignaturePlacementRepository extends JpaRepository<SignaturePlacement, Long> {
	List<SignaturePlacement> findByDocument(Document document);

	Optional<SignaturePlacement> findById(Long id);
}