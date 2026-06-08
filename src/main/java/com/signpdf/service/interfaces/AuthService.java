package com.signpdf.service.interfaces;

import com.signpdf.dto.request.LoginRequest;
import com.signpdf.dto.request.RegisterRequest;
import com.signpdf.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}