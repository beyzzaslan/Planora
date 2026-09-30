package com.beyza.backend.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.beyza.backend.dto.media.MediaResponse;
import com.beyza.backend.dto.media.UpdateMediaRequest;
import com.beyza.backend.entity.Media;
import com.beyza.backend.repository.MediaRepository;
import com.beyza.backend.repository.UserAccountRepository;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @Mock
    private MediaRepository mediaRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private MediaService mediaService;

    @Test
    void anotherUserCannotUpdateMedia() {
        Long mediaId = 25L;
        String otherUserEmail = "user-b@example.com";

        UpdateMediaRequest request = new UpdateMediaRequest(
                "Değiştirilmiş kaynak",
                "https://example.com/file.pdf",
                "application/pdf");

        when(mediaRepository.findByIdAndOwner_EmailIgnoreCase(
                mediaId,
                otherUserEmail))
                .thenReturn(Optional.empty());

        Optional<MediaResponse> result = mediaService.updateMedia(
                mediaId,
                request,
                otherUserEmail);

        assertTrue(result.isEmpty());

        verify(mediaRepository, never())
                .save(any(Media.class));
    }

    @Test
    void anotherUserCannotDeleteMedia() throws IOException {
        Long mediaId = 25L;
        String otherUserEmail = "user-b@example.com";

        when(mediaRepository.findByIdAndOwner_EmailIgnoreCase(
                mediaId,
                otherUserEmail))
                .thenReturn(Optional.empty());

        boolean deleted = mediaService.deleteMedia(
                mediaId,
                otherUserEmail);

        assertFalse(deleted);

        verify(mediaRepository, never())
                .delete(any(Media.class));
    }
}