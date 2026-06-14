package com.signpdf.service.interfaces;

public interface EmailService {

	void sendSigningRequestEmail(String recipientEmail, String token);
}