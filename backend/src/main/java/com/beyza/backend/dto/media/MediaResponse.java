package com.beyza.backend.dto.media;

import java.time.LocalDateTime;

import com.beyza.backend.entity.Media;

public record MediaResponse(
        Long id,
        String title,
        String fileName,
        String fileUrl,
        String mediaType,
        LocalDateTime createdAt) {

    public static MediaResponse from(Media media) {
        return new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getFileName(),
                media.getFileUrl(),
                media.getMediaType(),
                media.getCreatedAt());
    }
}







