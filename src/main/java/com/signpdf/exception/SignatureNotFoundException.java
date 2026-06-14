package com.signpdf.exception;

public class SignatureNotFoundException extends RuntimeException {

	public SignatureNotFoundException(String message) {
		super(message);
	}
}