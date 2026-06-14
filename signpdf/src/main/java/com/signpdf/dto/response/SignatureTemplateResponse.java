package com.signpdf.dto.response;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class SignatureTemplateResponse{
	Long id;

	String signatureName;

	SignatureType type;

	LocalDateTime createdAt;
}