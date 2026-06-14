package com.signpdf.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest{
	@NotBlank
	@Email
	String email;
	String password;
}