package com.beyza.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

import com.beyza.backend.entity.Media;
import com.beyza.backend.service.MediaService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public List<Media> getAllMedia(
            @AuthenticationPrincipal UserDetails userDetails) {

        return mediaService.getAllMedia(
                userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Media> getMediaById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return mediaService
                .getMediaById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Media> createMedia(
            @RequestBody Media media,
            @AuthenticationPrincipal UserDetails userDetails) {

        Media createdMedia = mediaService.createMedia(
                media,
                userDetails.getUsername());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMedia);
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadMedia(
            @RequestParam String title,
            @RequestParam MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            Media uploadedMedia = mediaService.uploadMedia(
                    title,
                    file,
                    userDetails.getUsername());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(uploadedMedia);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());

        } catch (IOException exception) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Dosya kaydedilirken bir hata oluştu.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Media> updateMedia(
            @PathVariable Long id,
            @RequestBody Media updatedMedia,
            @AuthenticationPrincipal UserDetails userDetails) {

        return mediaService
                .updateMedia(
                        id,
                        updatedMedia,
                        userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedia(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            boolean deleted = mediaService.deleteMedia(
                    id,
                    userDetails.getUsername());

            if (!deleted) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.noContent().build();

        } catch (IOException exception) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Dosya silinirken bir hata oluştu.");
        }
    }
}
