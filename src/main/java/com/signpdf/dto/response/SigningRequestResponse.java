package com.signpdf.dto.response;
import com.signpdf.enums.*;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class SigningRequestResponse{
	@NotNull
	Long id;

	Long documentId;

	String signerEmail;

	String token;

	SigningRequestStatus status;

	LocalDateTime expiresAt;
}