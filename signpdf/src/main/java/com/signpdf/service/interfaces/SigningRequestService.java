package com.signpdf.service.interfaces;

import com.signpdf.dto.request.CreateSigningRequestRequest;
import com.signpdf.dto.response.SigningRequestResponse;

import java.util.List;

public interface SigningRequestService {

	SigningRequestResponse createRequest(CreateSigningRequestRequest request);

	List<SigningRequestResponse> getMyRequests();

	SigningRequestResponse validateToken(String token);

	String completeSigning(String token);
}