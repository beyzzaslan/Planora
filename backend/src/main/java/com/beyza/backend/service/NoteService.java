package com.beyza.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.beyza.backend.entity.Note;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.NoteRepository;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service

@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;
    private final UserAccountRepository userAccountRepository;

    public List<Note> getAllNotes(String authenticatedEmail) {
        return noteRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        authenticatedEmail.trim());
    }

    public Optional<Note> getNoteById(Long id, String authenticatedEmail) {
        return noteRepository.findByIdAndOwner_EmailIgnoreCase(id, authenticatedEmail.trim());
    }

    public Note createNote(
            Note note,
            String authenticatedEmail) {

        UserAccount owner = userAccountRepository
                .findByEmailIgnoreCase(authenticatedEmail.trim())
                .orElseThrow(() -> new IllegalStateException(
                        "Kullanıcı bulunamadı."));

        note.setId(null);
        note.setOwner(owner);

        return noteRepository.save(note);
    }

    public Optional<Note> updateNote(
            Long id,
            Note updatedNote,
            String authenticatedEmail) {

        return noteRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(existingNote -> {
                    existingNote.setTitle(updatedNote.getTitle());
                    existingNote.setContent(updatedNote.getContent());
                    existingNote.setColor(updatedNote.getColor());
                    existingNote.setPinned(updatedNote.getPinned());

                    return noteRepository.save(existingNote);
                });
    }

    public Optional<Note> togglePin(
            Long id,
            String authenticatedEmail) {

        return noteRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(note -> {
                    note.setPinned(
                            !Boolean.TRUE.equals(note.getPinned()));

                    return noteRepository.save(note);
                });
    }

    public boolean deleteNote(
            Long id,
            String authenticatedEmail) {

        return noteRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(note -> {
                    noteRepository.delete(note);
                    return true;
                })
                .orElse(false);
    }
}
