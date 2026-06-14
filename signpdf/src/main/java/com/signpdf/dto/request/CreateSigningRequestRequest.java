package com.signpdf.dto.request;

import jakarta.validation.constraints.Email;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateSigningRequestRequest{
	Long documentId;

	@Email
	String signerEmail;
}