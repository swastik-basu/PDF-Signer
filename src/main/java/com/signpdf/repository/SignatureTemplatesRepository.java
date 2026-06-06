package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignatureTemplatesRepository extends JpaRepository<SignatureTemplates, Long>{
	List<SignatureTemplates> findByowner(User owner);
}