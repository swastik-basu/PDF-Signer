package com.signpdf.dto.request;

import org.springframework.web.multipart.MultipartFile;

import com.signpdf.enums.*;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateSignatureTemplateRequest {
	String signatureName;
	
	SignatureType type;
	
	String typedText;
	
	@Size(min =1 , max = 100)
	MultipartFile image;
}