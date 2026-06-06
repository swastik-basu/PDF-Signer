package com.signpdf.dto.response;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class SigningRequestResponse{
	Long id;

	String signerEmail;

	String token;

	SigningRequestStatus status;

	LocalDateTime expiresAt;
}