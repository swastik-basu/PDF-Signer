package com.signpdf.service.interfaces;

import com.signpdf.dto.request.CreateSignatureTemplateRequest;

import com.signpdf.dto.response.SignatureTemplateResponse;

import java.util.List;

public interface SignatureTemplateService {

	SignatureTemplateResponse createSignature(CreateSignatureTemplateRequest request);

	List<SignatureTemplateResponse> getMySignatures();

	SignatureTemplateResponse getSignatureById(Long signatureId);

	void deleteSignature(Long signatureId);
}