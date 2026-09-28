package com.beyza.backend.dto.note;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateNoteRequest(

        @Size(
                max = 200,
                message = "Not başlığı en fazla 200 karakter olabilir.")
        String title,

        @Size(
                max = 10000,
                message = "Not içeriği en fazla 10000 karakter olabilir.")
        String content,

        @NotBlank(message = "Not rengi boş olamaz.")
        @Pattern(
                regexp = "^#[0-9A-Fa-f]{6}$",
                message = "Not rengi geçerli bir HEX kodu olmalıdır.")
        String color

) {

    @AssertTrue(
            message = "Başlık veya içerikten en az biri doldurulmalıdır.")
    public boolean isTitleOrContentPresent() {
        boolean hasTitle =
                title != null && !title.isBlank();

        boolean hasContent =
                content != null && !content.isBlank();

        return hasTitle || hasContent;
    }
}