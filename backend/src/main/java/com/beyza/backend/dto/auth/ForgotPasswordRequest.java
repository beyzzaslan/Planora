package com.beyza.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest(

        @NotBlank(message = "E-posta adresi boş olamaz.")
        @Email(message = "Geçerli bir e-posta adresi giriniz.")
        @Size(
                max = 160,
                message = "E-posta en fazla 160 karakter olabilir.")
        String email

) {
}