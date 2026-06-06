package com.signpdf.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateSigningRequest{
	Long documentId;
	String singerEmail;
}