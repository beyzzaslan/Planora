package com.beyza.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "İsim boş olamaz.") @Size(min = 2, max = 100, message = "İsim 2 ile 100 karakter arasında olmalıdır.") String name,

        @NotBlank(message = "E-posta boş olamaz.") @Email(message = "Geçerli bir e-posta adresi giriniz.") @Size(max = 160, message = "E-posta en fazla 160 karakter olabilir.") String email,

        @NotBlank(message = "Şifre boş olamaz.") @Size(min = 8, max = 72, message = "Şifre 8 ile 72 karakter arasında olmalıdır.") String password,

        @NotBlank(message = "Şifre tekrarı boş olamaz.") String confirmPassword) {
}
// confirmPassword entity’de bulunmuyor çünkü veritabanına kaydedilmeyecek;
// yalnızca iki şifrenin eşleşmesini kontrol edeceğiz.