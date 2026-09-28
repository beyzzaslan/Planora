package com.beyza.backend.dto.task;

import java.time.LocalDate;
import java.time.LocalTime;

import com.beyza.backend.entity.Priority;
import com.beyza.backend.entity.Task;
import com.beyza.backend.entity.TaskStatus;

public record TaskResponse(
        Long id,
        String content,
        String color,
        Priority priority,
        LocalDate taskDate,
        LocalTime taskTime,
        TaskStatus status,
        boolean reminderEnabled,
        Integer reminderOffset) {

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getContent(),
                task.getColor(),
                task.getPriority(),
                task.getTaskDate(),
                task.getTaskTime(),
                task.getStatus(),
                Boolean.TRUE.equals(task.getReminderEnabled()),
                task.getReminderOffset());
    }
}