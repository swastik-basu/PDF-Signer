package com.signpdf.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest{
	@NotBlank
	String name;
	@Email
	String email;
	@Size
	String password;
}