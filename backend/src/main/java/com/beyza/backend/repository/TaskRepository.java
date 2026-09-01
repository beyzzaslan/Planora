package com.beyza.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beyza.backend.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

}
