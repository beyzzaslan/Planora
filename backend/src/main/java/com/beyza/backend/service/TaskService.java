package com.beyza.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beyza.backend.dto.task.CreateTaskRequest;
import com.beyza.backend.dto.task.TaskResponse;
import com.beyza.backend.dto.task.UpdateTaskRequest;
import com.beyza.backend.entity.Task;
import com.beyza.backend.entity.TaskStatus;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.TaskRepository;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(
            String authenticatedEmail) {

        return taskRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        authenticatedEmail.trim())
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getUpcomingReminders(
            String authenticatedEmail) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);

        return taskRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        authenticatedEmail.trim())
                .stream()
                .filter(task ->
                        Boolean.TRUE.equals(
                                task.getReminderEnabled()))
                .filter(task -> task.getTaskDate() != null)
                .filter(task -> task.getTaskTime() != null)
                .filter(task -> task.getReminderOffset() != null)
                .filter(task ->
                        task.getStatus() == TaskStatus.ACTIVE)
                .filter(task -> {
                    LocalDateTime taskDateTime =
                            LocalDateTime.of(
                                    task.getTaskDate(),
                                    task.getTaskTime());

                    LocalDateTime reminderDateTime =
                            taskDateTime.minusMinutes(
                                    task.getReminderOffset());

                    boolean taskHasNotPassed =
                            !taskDateTime.isBefore(now);

                    boolean reminderIsInNext24Hours =
                            !reminderDateTime.isAfter(tomorrow);

                    return taskHasNotPassed
                            && reminderIsInNext24Hours;
                })
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<TaskResponse> getTaskById(
            Long id,
            String authenticatedEmail) {

        return taskRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(TaskResponse::from);
    }

    @Transactional
    public TaskResponse createTask(
            CreateTaskRequest request,
            String authenticatedEmail) {

        UserAccount owner = getAuthenticatedUser(
                authenticatedEmail);

        Task task = new Task();

        task.setContent(request.content().trim());
        task.setColor(
                request.color().toUpperCase(Locale.ROOT));
        task.setPriority(request.priority());
        task.setTaskDate(request.taskDate());
        task.setTaskTime(request.taskTime());
        task.setStatus(TaskStatus.ACTIVE);

        boolean reminderEnabled =
                Boolean.TRUE.equals(
                        request.reminderEnabled());

        task.setReminderEnabled(reminderEnabled);

        task.setReminderOffset(
                reminderEnabled
                        ? request.reminderOffset()
                        : null);

        task.setOwner(owner);

        Task savedTask = taskRepository.save(task);

        return TaskResponse.from(savedTask);
    }

    @Transactional
    public Optional<TaskResponse> updateTask(
            Long id,
            UpdateTaskRequest request,
            String authenticatedEmail) {

        return taskRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(existingTask -> {
                    existingTask.setContent(
                            request.content().trim());

                    existingTask.setColor(
                            request.color()
                                    .toUpperCase(Locale.ROOT));

                    existingTask.setPriority(
                            request.priority());

                    existingTask.setTaskDate(
                            request.taskDate());

                    existingTask.setTaskTime(
                            request.taskTime());

                    existingTask.setStatus(
                            request.status());

                    boolean reminderEnabled =
                            Boolean.TRUE.equals(
                                    request.reminderEnabled());

                    existingTask.setReminderEnabled(
                            reminderEnabled);

                    existingTask.setReminderOffset(
                            reminderEnabled
                                    ? request.reminderOffset()
                                    : null);

                    Task savedTask =
                            taskRepository.save(existingTask);

                    return TaskResponse.from(savedTask);
                });
    }

    @Transactional
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

    private UserAccount getAuthenticatedUser(
            String authenticatedEmail) {

        return userAccountRepository
                .findByEmailIgnoreCase(
                        authenticatedEmail.trim())
                .orElseThrow(() -> new IllegalStateException(
                        "Kullanıcı bulunamadı."));
    }
}