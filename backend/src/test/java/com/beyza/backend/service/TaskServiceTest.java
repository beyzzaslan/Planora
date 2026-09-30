package com.beyza.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.beyza.backend.dto.task.TaskResponse;
import com.beyza.backend.dto.task.UpdateTaskRequest;
import com.beyza.backend.entity.Priority;
import com.beyza.backend.entity.Task;
import com.beyza.backend.entity.TaskStatus;
import com.beyza.backend.repository.TaskRepository;
import com.beyza.backend.repository.UserAccountRepository;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void anotherUserCannotUpdateTask() {
        Long taskId = 20L;
        String otherUserEmail = "user-b@example.com";

        UpdateTaskRequest request = new UpdateTaskRequest(
                "Değiştirilmiş görev",
                "#F9A8D4",
                Priority.MEDIUM,
                null,
                null,
                TaskStatus.ACTIVE,
                false,
                null);

        when(taskRepository.findByIdAndOwner_EmailIgnoreCase(
                taskId,
                otherUserEmail))
                .thenReturn(Optional.empty());

        Optional<TaskResponse> result = taskService.updateTask(
                taskId,
                request,
                otherUserEmail);

        assertTrue(result.isEmpty());

        verify(taskRepository, never())
                .save(any(Task.class));
    }

    @Test
    void anotherUserCannotDeleteTask() {
        Long taskId = 20L;
        String otherUserEmail = "user-b@example.com";

        when(taskRepository.findByIdAndOwner_EmailIgnoreCase(
                taskId,
                otherUserEmail))
                .thenReturn(Optional.empty());

        boolean deleted = taskService.deleteTask(
                taskId,
                otherUserEmail);

        assertFalse(deleted);

        verify(taskRepository, never())
                .delete(any(Task.class));
    }
}