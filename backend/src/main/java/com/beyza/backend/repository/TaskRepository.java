package com.beyza.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beyza.backend.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
            String email);

    Optional<Task> findByIdAndOwner_EmailIgnoreCase(
            Long id,
            String email);
}