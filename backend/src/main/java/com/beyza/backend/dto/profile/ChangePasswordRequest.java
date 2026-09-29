package com.beyza.backend.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank(message = "Mevcut şifre boş olamaz.")
        String currentPassword,

        @NotBlank(message = "Yeni şifre boş olamaz.")
        @Size(
                min = 8,
                max = 72,
                message = "Yeni şifre 8 ile 72 karakter arasında olmalıdır.")
        String newPassword,

        @NotBlank(message = "Yeni şifre tekrarı boş olamaz.")
        String confirmNewPassword) {
}