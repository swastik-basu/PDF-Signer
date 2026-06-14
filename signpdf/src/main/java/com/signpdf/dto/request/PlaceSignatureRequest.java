package com.signpdf.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSignatureRequest {

    @NotNull
    @Positive
    private Long documentId;

    @NotNull
    @Positive
    private Long signatureTemplateId;

    @NotNull
    @Positive
    private Integer pageNumber;

    @NotNull
    @PositiveOrZero
    private Double xCoordinate;

    @NotNull
    @PositiveOrZero
    private Double yCoordinate;

    @NotNull
    @Positive
    private Double width;

    @NotNull
    @Positive
    private Double height;

    @NotNull
    private Double rotation;
}