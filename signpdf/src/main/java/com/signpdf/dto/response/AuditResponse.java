package com.signpdf.dto.response;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class AuditResponse{
	Long id;

	AuditAction action;

	String description;

	String ipAddress;

	LocalDateTime timestamp;
}