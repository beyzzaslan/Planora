package com.beyza.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beyza.backend.entity.Note;
import com.beyza.backend.service.NoteService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;

    @GetMapping
    public List<Note> getAllNotes(
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService.getAllNotes(
                userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService
                .getNoteById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Note> createNote(
            @RequestBody Note note,
            @AuthenticationPrincipal UserDetails userDetails) {

        Note createdNote = noteService.createNote(
                note,
                userDetails.getUsername());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdNote);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable Long id,
            @RequestBody Note updatedNote,
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService
                .updateNote(
                        id,
                        updatedNote,
                        userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<Note> togglePin(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService
                .togglePin(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        boolean deleted = noteService.deleteNote(
                id,
                userDetails.getUsername());

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}