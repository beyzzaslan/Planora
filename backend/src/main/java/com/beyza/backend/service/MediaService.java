package com.beyza.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.beyza.backend.entity.Media;
import com.beyza.backend.repository.MediaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {
    private static final String LOCAL_UPLOAD_URL = "http://localhost:8080/uploads/";
    private final MediaRepository mediaRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    public Optional<Media> getMediaById(Long id) {
        return mediaRepository.findById(id);
    }

    public Media createMedia(Media media) {
        return mediaRepository.save(media);
    }

    public Media uploadMedia(String title, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz.");
        }

        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null
                        ? "file"
                        : file.getOriginalFilename());

        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Geçersiz dosya adı.");
        }

        String lowerFileName = originalFileName.toLowerCase();

        String extension;
        String contentType;

        if (lowerFileName.endsWith(".jpg")
                || lowerFileName.endsWith(".jpeg")) {
            extension = ".jpg";
            contentType = "image/jpeg";

        } else if (lowerFileName.endsWith(".png")) {
            extension = ".png";
            contentType = "image/png";

        } else if (lowerFileName.endsWith(".webp")) {
            extension = ".webp";
            contentType = "image/webp";

        } else if (lowerFileName.endsWith(".mp4")) {
            extension = ".mp4";
            contentType = "video/mp4";

        } else if (lowerFileName.endsWith(".pdf")) {
            extension = ".pdf";
            contentType = "application/pdf";

        } else {
            throw new IllegalArgumentException(
                    "Yalnızca JPG, PNG, WebP, MP4 ve PDF yükleyebilirsin.");
        }

        String storedFileName = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(uploadPath);

        Path targetPath = uploadPath
                .resolve(storedFileName)
                .normalize();

        if (!targetPath.startsWith(uploadPath)) {
            throw new IllegalArgumentException("Geçersiz dosya yolu.");
        }

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING);

        Media media = new Media();
        media.setTitle(title.trim());
        media.setFileName(originalFileName);
        media.setFileUrl(LOCAL_UPLOAD_URL + storedFileName);
        media.setMediaType(contentType);

        return mediaRepository.save(media);
    }

    public Optional<Media> updateMedia(Long id, Media updatedMedia) {
        return mediaRepository.findById(id).map(existing -> {
            existing.setTitle(updatedMedia.getTitle());
            existing.setFileName(updatedMedia.getFileName());
            existing.setFileUrl(updatedMedia.getFileUrl());
            existing.setMediaType(updatedMedia.getMediaType());
            return mediaRepository.save(existing);

        });
    }

    public boolean deleteMedia(Long id) throws IOException {
        Optional<Media> mediaOptional = mediaRepository.findById(id);

        if (mediaOptional.isEmpty()) {
            return false;
        }

        Media media = mediaOptional.get();

        deleteUploadedFile(media);

        mediaRepository.delete(media);
        return true;
    }

    private void deleteUploadedFile(Media media) throws IOException {
        String fileUrl = media.getFileUrl();

        if (fileUrl == null || !fileUrl.startsWith(LOCAL_UPLOAD_URL)) {
            return;
        }

        String storedFileName = fileUrl.substring(LOCAL_UPLOAD_URL.length());

        Path uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        Path filePath = uploadPath
                .resolve(storedFileName)
                .normalize();

        if (!filePath.startsWith(uploadPath)) {
            throw new IllegalArgumentException("Geçersiz dosya yolu.");
        }

        Files.deleteIfExists(filePath);
    }

}