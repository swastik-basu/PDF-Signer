package com.signpdf.service.impl;

import com.signpdf.dto.request.LoginRequest;
import com.signpdf.dto.request.RegisterRequest;
import com.signpdf.dto.response.AuthResponse;

import com.signpdf.entity.User;

import com.signpdf.enums.Role;

import com.signpdf.repository.UserRepository;

import com.signpdf.security.JwtService;

import com.signpdf.service.interfaces.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final JwtService jwtService;

	private final AuthenticationManager authenticationManager;

	@Override
	public AuthResponse register(RegisterRequest request) {

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email already exists");
		}

		User user = User.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).role(Role.USER).build();

		User savedUser = userRepository.save(user);

		String token = jwtService.generateToken(new com.signpdf.security.customUserDetails(savedUser));

		return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
				savedUser.getRole());
	}

	@Override
	public AuthResponse login(LoginRequest request) {

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		String token = jwtService.generateToken(new com.signpdf.security.customUserDetails(user));

		return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
	}
}