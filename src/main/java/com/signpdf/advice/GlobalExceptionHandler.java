package com.signpdf.advice;

import com.signpdf.dto.response.ErrorResponse;
import com.signpdf.exception.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DocumentNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleDocumentNotFound(DocumentNotFoundException ex) {

		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ErrorResponse(404, ex.getMessage(), LocalDateTime.now()));
	}

	@ExceptionHandler(SignatureNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleSignatureNotFound(SignatureNotFoundException ex) {

		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ErrorResponse(404, ex.getMessage(), LocalDateTime.now()));
	}

	@ExceptionHandler(SignedDocumentNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleSignedDocumentNotFound(SignedDocumentNotFoundException ex) {

		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ErrorResponse(404, ex.getMessage(), LocalDateTime.now()));
	}

	@ExceptionHandler(UnauthorizedAccessException.class)
	public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedAccessException ex) {

		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(new ErrorResponse(403, ex.getMessage(), LocalDateTime.now()));
	}

	@ExceptionHandler(FileValidationException.class)
	public ResponseEntity<ErrorResponse> handleFileValidation(FileValidationException ex) {

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ErrorResponse(400, ex.getMessage(), LocalDateTime.now()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ErrorResponse(500, ex.getMessage(), LocalDateTime.now()));
	}
}