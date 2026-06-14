package com.signpdf.exception;

public class SignedDocumentNotFoundException extends RuntimeException {

	public SignedDocumentNotFoundException(String message) {
		super(message);
	}
}