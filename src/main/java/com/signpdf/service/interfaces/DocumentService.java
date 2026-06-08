package com.signpdf.service.interfaces;

import com.signpdf.dto.response.DocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    DocumentResponse uploadDocument(
            MultipartFile file
    );

    List<DocumentResponse> getMyDocuments();

    DocumentResponse getDocumentById(
            Long documentId
    );

    void deleteDocument(
            Long documentId
    );
}