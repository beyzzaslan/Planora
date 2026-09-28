package com.beyza.backend.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.beyza.backend.dto.media.CreateMediaRequest;
import com.beyza.backend.dto.media.MediaResponse;
import com.beyza.backend.dto.media.UpdateMediaRequest;
import com.beyza.backend.service.MediaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public List<MediaResponse> getAllMedia(
            @AuthenticationPrincipal UserDetails userDetails) {
        return mediaService.getAllMedia(userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> getMediaById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return mediaService
                .getMediaById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<?> getMediaFile(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            Optional<MediaService.StoredMediaFile> fileOptional =
                    mediaService.getMediaFile(id, userDetails.getUsername());

            if (fileOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            MediaService.StoredMediaFile storedFile = fileOptional.get();
            Resource resource = storedFile.resource();
            ContentDisposition contentDisposition = ContentDisposition
                    .inline()
                    .filename(storedFile.originalFileName(), StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(storedFile.contentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                    .body(resource);

        } catch (IOException exception) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Dosya okunurken bir hata oluştu.");
        }
    }

    @PostMapping
    public ResponseEntity<MediaResponse> createMedia(
            @Valid @RequestBody CreateMediaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        MediaResponse createdMedia = mediaService.createMedia(
                request,
                userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdMedia);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMedia(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            MediaResponse uploadedMedia = mediaService.uploadMedia(
                    title,
                    file,
                    userDetails.getUsername());

            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedMedia);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (IOException exception) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Dosya yüklenirken bir hata oluştu.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaResponse> updateMedia(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMediaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return mediaService
                .updateMedia(id, request, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            boolean deleted = mediaService.deleteMedia(id, userDetails.getUsername());

            return deleted
                    ? ResponseEntity.noContent().build()
                    : ResponseEntity.notFound().build();
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
