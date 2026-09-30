package com.beyza.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.beyza.backend.dto.note.NoteResponse;
import com.beyza.backend.dto.note.UpdateNoteRequest;
import com.beyza.backend.entity.Note;
import com.beyza.backend.repository.NoteRepository;
import com.beyza.backend.repository.UserAccountRepository;
import static org.junit.jupiter.api.Assertions.assertFalse;
@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private NoteService noteService;

    @Test
    void anotherUserCannotUpdateNote() {
        Long noteId = 15L;
        String otherUserEmail = "user-b@example.com";

        UpdateNoteRequest request = new UpdateNoteRequest(
                "Değiştirilmiş başlık",
                "Değiştirilmiş içerik",
                "#F9A8D4");

        when(noteRepository.findByIdAndOwner_EmailIgnoreCase(
                noteId,
                otherUserEmail))
                .thenReturn(Optional.empty());

        Optional<NoteResponse> result = noteService.updateNote(
                noteId,
                request,
                otherUserEmail);

        assertTrue(result.isEmpty());

        verify(noteRepository)
                .findByIdAndOwner_EmailIgnoreCase(
                        noteId,
                        otherUserEmail);

        verify(noteRepository, never())
                .save(any(Note.class));
    }


@Test
void anotherUserCannotDeleteNote() {
    Long noteId = 15L;
    String otherUserEmail = "user-b@example.com";

    when(noteRepository.findByIdAndOwner_EmailIgnoreCase(
            noteId,
            otherUserEmail))
            .thenReturn(Optional.empty());

    boolean deleted = noteService.deleteNote(
            noteId,
            otherUserEmail);

    assertFalse(deleted);

    verify(noteRepository)
            .findByIdAndOwner_EmailIgnoreCase(
                    noteId,
                    otherUserEmail);

    verify(noteRepository, never())
            .delete(any(Note.class));
}}