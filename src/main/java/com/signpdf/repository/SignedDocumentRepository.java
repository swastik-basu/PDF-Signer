package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SignedDocumentRepository extends JpaRepository<SignedDocument, Long>{
	Optional<SignedDocument> findByDocument(Document document);
}