package com.beyza.backend.dto.note;

import com.beyza.backend.entity.Note;

public record NoteResponse(
        Long id,
        String title,
        String content,
        String color,
        boolean pinned) {

    public static NoteResponse from(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getColor(),
                Boolean.TRUE.equals(note.getPinned()));
    }
}