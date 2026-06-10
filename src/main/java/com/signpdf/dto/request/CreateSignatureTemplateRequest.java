package com.signpdf.dto.request;

import org.springframework.web.multipart.MultipartFile;

import com.signpdf.enums.*;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateSignatureTemplateRequest {
	String signatureName;
	
	SignatureType type;
	
	String typedText;
	
	MultipartFile image;
}