package com.signpdf.repository;

import com.signpdf.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SigningRequestRepository extends JpaRepository<SigningRequest, Long>{
	Optional<SigningRequest> findByToken(String token);
}