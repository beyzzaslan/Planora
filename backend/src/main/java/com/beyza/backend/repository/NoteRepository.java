package com.beyza.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beyza.backend.entity.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findAllByOwner_EmailIgnoreCaseOrderByIdDesc(String email);

    Optional<Note> findByIdAndOwner_EmailIgnoreCase(Long id, String email);
}