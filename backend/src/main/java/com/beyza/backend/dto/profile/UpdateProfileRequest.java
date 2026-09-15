package com.beyza.backend.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(

        @NotBlank(message = "İsim boş olamaz.") @Size(min = 2, max = 100, message = "İsim 2 ile 100 karakter arasında olmalıdır.") String name,

        @NotBlank(message = "Odak alanı boş olamaz.") @Size(max = 100, message = "Odak alanı en fazla 100 karakter olabilir.") String focus

) {
}