package com.beyza.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.beyza.backend.entity.Task;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.TaskRepository;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserAccountRepository userAccountRepository;

    public List<Task> getAllTasks(String authenticatedEmail) {
        return taskRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        authenticatedEmail.trim());
    }

    public List<Task> getUpcomingReminders(
            String authenticatedEmail) {

        LocalDateTime now = LocalDateTime.now();

        return taskRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        authenticatedEmail.trim())
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

                    return taskHasNotPassed
                            && reminderIsInNext24Hours;
                })
                .collect(Collectors.toList());
    }

    public Optional<Task> getTaskById(
            Long id,
            String authenticatedEmail) {

        return taskRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim());
    }

    public Task createTask(
            Task task,
            String authenticatedEmail) {

        UserAccount owner = userAccountRepository
                .findByEmailIgnoreCase(authenticatedEmail.trim())
                .orElseThrow(() -> new IllegalStateException(
                        "Kullanıcı bulunamadı."));

        task.setId(null);
        task.setOwner(owner);

        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(
            Long id,
            Task updatedTask,
            String authenticatedEmail) {

        return taskRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(existingTask -> {
                    existingTask.setContent(updatedTask.getContent());
                    existingTask.setColor(updatedTask.getColor());
                    existingTask.setPriority(updatedTask.getPriority());
                    existingTask.setTaskDate(updatedTask.getTaskDate());
                    existingTask.setTaskTime(updatedTask.getTaskTime());
                    existingTask.setStatus(updatedTask.getStatus());
                    existingTask.setReminderEnabled(
                            updatedTask.getReminderEnabled());
                    existingTask.setReminderOffset(
                            updatedTask.getReminderOffset());

                    return taskRepository.save(existingTask);
                });
    }

    public boolean deleteTask(
            Long id,
            String authenticatedEmail) {

        return taskRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(task -> {
                    taskRepository.delete(task);
                    return true;
                })
                .orElse(false);
    }
}
