package com.signpdf.dto.response;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ApiResponse<T>{
	private boolean success;

	private String message;

	private T data;
}