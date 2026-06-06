package com.signpdf.dto.response;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;
@Data
@AllArgsConstructor
public class SignaturePlacementResponse{
	Long id;

	Long documentId;

	Long signatureTemplateId;

	Integer pageNumber;

	Double xCoordinate;

	Double yCoordinate;

	Double width;

	Double height;

	Double rotation;

	SignaturePlacementStatus status;
}