package com.signpdf.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignedDocumentResponse {

    private Long id;

    private Long documentId;

    private LocalDateTime generatedAt;

    private String message;
}