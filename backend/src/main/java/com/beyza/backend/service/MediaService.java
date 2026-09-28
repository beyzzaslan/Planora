package com.beyza.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.beyza.backend.dto.media.CreateMediaRequest;
import com.beyza.backend.dto.media.MediaResponse;
import com.beyza.backend.dto.media.UpdateMediaRequest;
import com.beyza.backend.entity.Media;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.MediaRepository;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final String LOCAL_UPLOAD_URL = "http://localhost:8080/uploads/";

    private final MediaRepository mediaRepository;
    private final UserAccountRepository userAccountRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public List<MediaResponse> getAllMedia(String authenticatedEmail) {
        return mediaRepository
                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(authenticatedEmail.trim())
                .stream()
                .map(MediaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<StoredMediaFile> getMediaFile(
            Long id,
            String authenticatedEmail) throws IOException {

        Optional<Media> mediaOptional = mediaRepository
                .findByIdAndOwner_EmailIgnoreCase(id, authenticatedEmail.trim());

        if (mediaOptional.isEmpty()) {
            return Optional.empty();
        }

        Media media = mediaOptional.get();
        String fileUrl = media.getFileUrl();

        if (fileUrl == null || !fileUrl.startsWith(LOCAL_UPLOAD_URL)) {
            return Optional.empty();
        }

        String storedFileName = fileUrl.substring(LOCAL_UPLOAD_URL.length());
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(storedFileName).normalize();

        if (!filePath.startsWith(uploadPath) || !Files.isRegularFile(filePath)) {
            return Optional.empty();
        }

        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.isReadable()) {
            return Optional.empty();
        }

        String contentType = media.getMediaType();

        if (contentType == null || contentType.isBlank()) {
            contentType = Files.probeContentType(filePath);
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return Optional.of(new StoredMediaFile(
                resource,
                contentType,
                media.getFileName()));
    }

    @Transactional(readOnly = true)
    public Optional<MediaResponse> getMediaById(Long id, String authenticatedEmail) {
        return mediaRepository
                .findByIdAndOwner_EmailIgnoreCase(id, authenticatedEmail.trim())
                .map(MediaResponse::from);
    }

    @Transactional
    public MediaResponse createMedia(
            CreateMediaRequest request,
            String authenticatedEmail) {

        UserAccount owner = getAuthenticatedUser(authenticatedEmail);

        Media media = new Media();
        media.setTitle(request.title().trim());
        media.setFileName(request.title().trim());
        media.setFileUrl(request.fileUrl().trim());
        media.setMediaType(request.mediaType().trim());
        media.setOwner(owner);

        return MediaResponse.from(mediaRepository.save(media));
    }

    @Transactional
    public MediaResponse uploadMedia(
            String title,
            MultipartFile file,
            String authenticatedEmail) throws IOException {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Başlık boş olamaz.");
        }

        if (title.trim().length() > 255) {
            throw new IllegalArgumentException("Başlık en fazla 255 karakter olabilir.");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz.");
        }

        UserAccount owner = getAuthenticatedUser(authenticatedEmail);
        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());

        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Geçersiz dosya adı.");
        }

        String lowerFileName = originalFileName.toLowerCase(Locale.ROOT);
        String extension;
        String contentType;

        if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg")) {
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
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        Files.createDirectories(uploadPath);
        Path targetPath = uploadPath.resolve(storedFileName).normalize();

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
        media.setOwner(owner);

        return MediaResponse.from(mediaRepository.save(media));
    }

    @Transactional
    public Optional<MediaResponse> updateMedia(
            Long id,
            UpdateMediaRequest request,
            String authenticatedEmail) {

        return mediaRepository
                .findByIdAndOwner_EmailIgnoreCase(id, authenticatedEmail.trim())
                .map(existingMedia -> {
                    existingMedia.setTitle(request.title().trim());
                    existingMedia.setFileName(request.title().trim());
                    existingMedia.setFileUrl(request.fileUrl().trim());
                    existingMedia.setMediaType(request.mediaType().trim());

                    return MediaResponse.from(mediaRepository.save(existingMedia));
                });
    }

    @Transactional
    public boolean deleteMedia(Long id, String authenticatedEmail) throws IOException {
        Optional<Media> mediaOptional = mediaRepository
                .findByIdAndOwner_EmailIgnoreCase(id, authenticatedEmail.trim());

        if (mediaOptional.isEmpty()) {
            return false;
        }

        Media media = mediaOptional.get();
        deleteUploadedFile(media);
        mediaRepository.delete(media);

        return true;
    }

    private UserAccount getAuthenticatedUser(String authenticatedEmail) {
        return userAccountRepository
                .findByEmailIgnoreCase(authenticatedEmail.trim())
                .orElseThrow(() -> new IllegalStateException("Kullanıcı bulunamadı."));
    }

    private void deleteUploadedFile(Media media) throws IOException {
        String fileUrl = media.getFileUrl();

        if (fileUrl == null || !fileUrl.startsWith(LOCAL_UPLOAD_URL)) {
            return;
        }

        String storedFileName = fileUrl.substring(LOCAL_UPLOAD_URL.length());
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(storedFileName).normalize();

        if (!filePath.startsWith(uploadPath)) {
            throw new IllegalArgumentException("Geçersiz dosya yolu.");
        }

        Files.deleteIfExists(filePath);
    }

    public record StoredMediaFile(
            Resource resource,
            String contentType,
            String originalFileName) {
    }
}
