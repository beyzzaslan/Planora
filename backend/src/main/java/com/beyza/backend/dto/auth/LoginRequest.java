package com.beyza.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "E-posta boş olamaz.") @Email(message = "Geçerli bir e-posta adresi giriniz.") String email,

        @NotBlank(message = "Şifre boş olamaz.") String password) {
}
// Login sırasında yalnızca e-posta ve şifre gerekiyor: