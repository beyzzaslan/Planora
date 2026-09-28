package com.beyza.backend.dto.task;

import java.time.LocalDate;
import java.time.LocalTime;

import com.beyza.backend.entity.Priority;
import com.beyza.backend.entity.TaskStatus;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(

        @NotBlank(message = "Görev içeriği boş olamaz.")
        @Size(
                max = 255,
                message = "Görev içeriği en fazla 255 karakter olabilir.")
        String content,

        @NotBlank(message = "Görev rengi boş olamaz.")
        @Pattern(
                regexp = "^#[0-9A-Fa-f]{6}$",
                message = "Görev rengi geçerli bir HEX kodu olmalıdır.")
        String color,

        @NotNull(message = "Görev önceliği boş olamaz.")
        Priority priority,

        LocalDate taskDate,

        LocalTime taskTime,

        @NotNull(message = "Görev durumu boş olamaz.")
        TaskStatus status,

        @NotNull(message = "Hatırlatıcı durumu boş olamaz.")
        Boolean reminderEnabled,

        @Min(
                value = 1,
                message = "Hatırlatıcı süresi en az 1 dakika olmalıdır.")
        @Max(
                value = 10080,
                message = "Hatırlatıcı süresi en fazla 7 gün olabilir.")
        Integer reminderOffset

) {

    @AssertTrue(
            message = "Hatırlatıcı için tarih, saat ve süre gereklidir.")
    public boolean isReminderConfigurationValid() {
        if (!Boolean.TRUE.equals(reminderEnabled)) {
            return true;
        }

        return taskDate != null
                && taskTime != null
                && reminderOffset != null;
    }
}