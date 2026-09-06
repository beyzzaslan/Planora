package com.beyza.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.beyza.backend.entity.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

}