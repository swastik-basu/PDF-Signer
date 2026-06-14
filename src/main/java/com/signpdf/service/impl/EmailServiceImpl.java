package com.signpdf.service.impl;

import com.signpdf.service.interfaces.EmailService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender mailSender;

	@Value("${app.frontend.url}")
	private String frontendUrl;

	@Override
	public void sendSigningRequestEmail(String recipientEmail, String token) {

		String signingLink = frontendUrl + "/sign/" + token;

		SimpleMailMessage message = new SimpleMailMessage();

		message.setTo(recipientEmail);

		message.setSubject("Document Signature Request");

		message.setText("""
				You have received a document signature request.

				Click the link below to sign:

				%s

				This link will expire in 7 days.

				Regards,
				SignPDF Team
				""".formatted(signingLink));

		mailSender.send(message);
	}
}