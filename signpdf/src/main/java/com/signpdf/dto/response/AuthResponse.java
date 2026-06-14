package com.signpdf.dto.response;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse{
	String token;
	Long userId;
	String name;
	String email;
	Role role;
}