package com.beyza.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beyza.backend.dto.note.CreateNoteRequest;
import com.beyza.backend.dto.note.NoteResponse;
import com.beyza.backend.dto.note.UpdateNoteRequest;
import com.beyza.backend.service.NoteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<NoteResponse> getAllNotes(
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService.getAllNotes(
                userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService
                .getNoteById(
                        id,
                        userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(
            @Valid @RequestBody CreateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        NoteResponse createdNote =
                noteService.createNote(
                        request,
                        userDetails.getUsername());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdNote);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService
                .updateNote(
                        id,
                        request,
                        userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<NoteResponse> togglePin(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return noteService
                .togglePin(
                        id,
                        userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
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