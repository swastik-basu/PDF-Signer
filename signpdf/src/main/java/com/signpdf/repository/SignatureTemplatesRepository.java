package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SignatureTemplatesRepository extends JpaRepository<SignatureTemplates, Long>{
	List<SignatureTemplates> findByOwner(User owner);

	Optional<SignatureTemplates> findByIdAndOwner(
	        Long id,
	        User owner
	);
}