package com.beyza.backend.dto.media;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateMediaRequest(

        @NotBlank(message = "Kaynak başlığı boş olamaz.")
        @Size(max = 255, message = "Kaynak başlığı en fazla 255 karakter olabilir.")
        String title,

        @NotBlank(message = "Kaynak bağlantısı boş olamaz.")
        @Size(max = 2048, message = "Kaynak bağlantısı en fazla 2048 karakter olabilir.")
        @Pattern(
                regexp = "^https?://\\S+$",
                message = "Kaynak bağlantısı http:// veya https:// ile başlamalıdır.")
        String fileUrl,

        @NotBlank(message = "Kaynak türü boş olamaz.")
        @Pattern(
                regexp = "^(image/(jpeg|png|webp)|video/mp4|application/pdf|text/html)$",
                message = "Desteklenmeyen kaynak türü.")
        String mediaType

) {
}
