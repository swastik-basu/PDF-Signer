package com.signpdf.dto.response;
import java.time.LocalDateTime;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class DocumentResponse{
	Long id;
	String fileName;
	Long fileSize;
	DocumentStatus status;
	LocalDateTime createdAt;
}