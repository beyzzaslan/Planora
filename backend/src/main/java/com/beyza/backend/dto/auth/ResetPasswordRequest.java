package com.beyza.backend.dto.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(

        @NotBlank(message = "Şifre sıfırlama tokenı boş olamaz.")
        @Size(
                max = 512,
                message = "Şifre sıfırlama tokenı geçersiz.")
        String token,

        @NotBlank(message = "Yeni şifre boş olamaz.")
        @Size(
                min = 8,
                max = 72,
                message = "Yeni şifre 8 ile 72 karakter arasında olmalıdır.")
        String newPassword,

        @NotBlank(message = "Yeni şifre tekrarı boş olamaz.")
        String confirmPassword

) {

    @AssertTrue(message = "Yeni şifreler eşleşmiyor.")
    public boolean isPasswordsMatch() {
        if (newPassword == null
                || confirmPassword == null) {

            return false;
        }

        return newPassword.equals(confirmPassword);
    }
}