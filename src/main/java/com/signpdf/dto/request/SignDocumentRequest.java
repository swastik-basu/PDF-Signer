package com.signpdf.dto.request;
import org.springframework.web.multipart.MultipartFile;

import com.signpdf.enums.*;

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