package com.beyza.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.beyza.backend.entity.Note;
import com.beyza.backend.repository.NoteRepository;

import lombok.RequiredArgsConstructor;

@Service

@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    public Optional<Note> updateNote(Long id, Note updatedNote) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(updatedNote.getTitle());
            note.setContent(updatedNote.getContent());
            note.setColor(updatedNote.getColor());
            note.setPinned(updatedNote.getPinned());
            return noteRepository.save(note);
        });
    }

    public Optional<Note> togglePin(Long id) {
        return noteRepository.findById(id).map(note -> {
            note.setPinned(!Boolean.TRUE.equals(note.getPinned()));
            return noteRepository.save(note);
        });
    }

    public boolean deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            return false; // repoda yoksa zaten silemeyiz
        }

        noteRepository.deleteById(id);
        return true;
    }
}
