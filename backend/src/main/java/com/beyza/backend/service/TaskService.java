package com.beyza.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.beyza.backend.entity.Task;
import com.beyza.backend.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getUpcomingReminders() {
        LocalDateTime now = LocalDateTime.now();

        return taskRepository.findAll()
                .stream()
                .filter(task -> Boolean.TRUE.equals(task.getReminderEnabled()))
                .filter(task -> task.getTaskDate() != null)
                .filter(task -> task.getTaskTime() != null)
                .filter(task -> task.getReminderOffset() != null)
                .filter(task -> task.getStatus() != null
                        && task.getStatus().name().equals("ACTIVE"))
                .filter(task -> {
                    LocalDateTime taskDateTime = LocalDateTime.of(
                            task.getTaskDate(),
                            task.getTaskTime());

                    LocalDateTime reminderDateTime = taskDateTime
                            .minusMinutes(task.getReminderOffset());

                    LocalDateTime tomorrow = now.plusDays(1);
                    boolean taskHasNotPassed = !taskDateTime.isBefore(now);
                    boolean reminderIsInNext24Hours = !reminderDateTime.isAfter(tomorrow);

                    return taskHasNotPassed && reminderIsInNext24Hours;
                })
                .collect(Collectors.toList());
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setContent(updatedTask.getContent());
            task.setColor(updatedTask.getColor());
            task.setPriority(updatedTask.getPriority());
            task.setTaskDate(updatedTask.getTaskDate());
            task.setTaskTime(updatedTask.getTaskTime());
            task.setStatus(updatedTask.getStatus());
            task.setReminderEnabled(updatedTask.getReminderEnabled());
            task.setReminderOffset(updatedTask.getReminderOffset());
            return taskRepository.save(task);
        });
    }

    public boolean deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }
        taskRepository.deleteById(id);
        return true;
    }
}
