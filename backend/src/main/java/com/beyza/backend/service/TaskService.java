package com.beyza.backend.service;

import java.util.List;
import java.util.Optional;

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
