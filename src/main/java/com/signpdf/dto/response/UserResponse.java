package com.signpdf.dto.response;
import com.signpdf.enums.*;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class UserResponse{
	Long id;
	String name;
	String email;
	Role role;
}