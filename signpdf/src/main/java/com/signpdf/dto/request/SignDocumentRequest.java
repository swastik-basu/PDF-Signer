package com.signpdf.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignDocumentRequest{
	@NotBlank
	Long signingRequestId;
	
	@NotBlank
	Long signatureTemplateId;
}