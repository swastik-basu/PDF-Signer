package com.signpdf.dto.response;
import java.time.LocalDateTime;

import com.signpdf.enums.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignaturePlacementResponse{
	Long Id;

	Long DocumentId;

	Long signatureTemplateId;

	Integer pageNumber;

	Double xCoordinate;

	Double yCoordinate;

	Double width;

	Double height;

	Double rotation;

	SignaturePlacementStatus status;
	
	LocalDateTime createdAt;
}