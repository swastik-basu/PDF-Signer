package com.signpdf.util;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RequestUtils {

    private final HttpServletRequest request;

    public String getClientIpAddress() {

        String forwarded =
                request.getHeader(
                        "X-Forwarded-For"
                );

        if (forwarded != null
                && !forwarded.isEmpty()
                && !"unknown".equalsIgnoreCase(
                        forwarded
                )) {

            return forwarded.split(",")[0];
        }

        return request.getRemoteAddr();
    }
}