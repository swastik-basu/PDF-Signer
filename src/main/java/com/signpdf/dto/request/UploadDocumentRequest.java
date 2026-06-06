package com.signpdf.dto.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadDocumentRequest{
	
	@Size(min=8 , max =100)
	MultipartFile file;
}