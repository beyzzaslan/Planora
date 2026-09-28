package com.beyza.backend.service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beyza.backend.dto.note.CreateNoteRequest;
import com.beyza.backend.dto.note.NoteResponse;
import com.beyza.backend.dto.note.UpdateNoteRequest;
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

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes(
            String authenticatedEmail) {

        return noteRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        authenticatedEmail.trim())
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<NoteResponse> getNoteById(
            Long id,
            String authenticatedEmail) {

        return noteRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(NoteResponse::from);
    }

    @Transactional
    public NoteResponse createNote(
            CreateNoteRequest request,
            String authenticatedEmail) {

        UserAccount owner = getAuthenticatedUser(
                authenticatedEmail);

        Note note = new Note();

        note.setTitle(normalizeText(request.title()));
        note.setContent(normalizeText(request.content()));
        note.setColor(
                request.color().toUpperCase(Locale.ROOT));
        note.setPinned(false);
        note.setOwner(owner);

        Note savedNote = noteRepository.save(note);

        return NoteResponse.from(savedNote);
    }

    @Transactional
    public Optional<NoteResponse> updateNote(
            Long id,
            UpdateNoteRequest request,
            String authenticatedEmail) {

        return noteRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(existingNote -> {
                    existingNote.setTitle(
                            normalizeText(request.title()));

                    existingNote.setContent(
                            normalizeText(request.content()));

                    existingNote.setColor(
                            request.color()
                                    .toUpperCase(Locale.ROOT));

                    Note savedNote =
                            noteRepository.save(existingNote);

                    return NoteResponse.from(savedNote);
                });
    }

    @Transactional
    public Optional<NoteResponse> togglePin(
            Long id,
            String authenticatedEmail) {

        return noteRepository
                .findByIdAndOwner_EmailIgnoreCase(
                        id,
                        authenticatedEmail.trim())
                .map(note -> {
                    note.setPinned(
                            !Boolean.TRUE.equals(note.getPinned()));

                    Note savedNote = noteRepository.save(note);

                    return NoteResponse.from(savedNote);
                });
    }

    @Transactional
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

    private UserAccount getAuthenticatedUser(
            String authenticatedEmail) {

        return userAccountRepository
                .findByEmailIgnoreCase(
                        authenticatedEmail.trim())
                .orElseThrow(() -> new IllegalStateException(
                        "Kullanıcı bulunamadı."));
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }
}