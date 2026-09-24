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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

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

        public List<Media> getAllMedia(
                        String authenticatedEmail) {

                return mediaRepository
                                .findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                                                authenticatedEmail.trim());
        }

        public Optional<StoredMediaFile> getMediaFile(
                        Long id,
                        String authenticatedEmail) throws IOException {

                Optional<Media> mediaOptional = mediaRepository
                                .findByIdAndOwner_EmailIgnoreCase(
                                                id,
                                                authenticatedEmail.trim());

                if (mediaOptional.isEmpty()) {
                        return Optional.empty();
                }

                Media media = mediaOptional.get();
                String fileUrl = media.getFileUrl();

                if (fileUrl == null
                                || !fileUrl.startsWith(LOCAL_UPLOAD_URL)) {

                        return Optional.empty();
                }

                String storedFileName = fileUrl.substring(
                                LOCAL_UPLOAD_URL.length());

                Path uploadPath = Paths.get(uploadDir)
                                .toAbsolutePath()
                                .normalize();

                Path filePath = uploadPath
                                .resolve(storedFileName)
                                .normalize();

                if (!filePath.startsWith(uploadPath)
                                || !Files.isRegularFile(filePath)) {

                        return Optional.empty();
                }

                Resource resource = new UrlResource(
                                filePath.toUri());

                if (!resource.isReadable()) {
                        return Optional.empty();
                }

                return Optional.of(
                                new StoredMediaFile(
                                                resource,
                                                media.getMediaType(),
                                                media.getFileName()));
        }

        public Optional<Media> getMediaById(
                        Long id,
                        String authenticatedEmail) {

                return mediaRepository
                                .findByIdAndOwner_EmailIgnoreCase(
                                                id,
                                                authenticatedEmail.trim());
        }

        public Media createMedia(
                        Media media,
                        String authenticatedEmail) {

                UserAccount owner = getAuthenticatedUser(
                                authenticatedEmail);

                media.setId(null);
                media.setOwner(owner);

                return mediaRepository.save(media);
        }

        public Media uploadMedia(
                        String title,
                        MultipartFile file,
                        String authenticatedEmail) throws IOException {

                if (file.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Dosya boş olamaz.");
                }

                UserAccount owner = getAuthenticatedUser(
                                authenticatedEmail);

                String originalFileName = StringUtils.cleanPath(
                                file.getOriginalFilename() == null
                                                ? "file"
                                                : file.getOriginalFilename());

                if (originalFileName.contains("..")) {
                        throw new IllegalArgumentException(
                                        "Geçersiz dosya adı.");
                }

                String lowerFileName = originalFileName
                                .toLowerCase(Locale.ROOT);

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

                String storedFileName = UUID.randomUUID()
                                + extension;

                Path uploadPath = Paths.get(uploadDir)
                                .toAbsolutePath()
                                .normalize();

                Files.createDirectories(uploadPath);

                Path targetPath = uploadPath
                                .resolve(storedFileName)
                                .normalize();

                if (!targetPath.startsWith(uploadPath)) {
                        throw new IllegalArgumentException(
                                        "Geçersiz dosya yolu.");
                }

                Files.copy(
                                file.getInputStream(),
                                targetPath,
                                StandardCopyOption.REPLACE_EXISTING);

                Media media = new Media();

                media.setTitle(title.trim());
                media.setFileName(originalFileName);
                media.setFileUrl(
                                LOCAL_UPLOAD_URL + storedFileName);
                media.setMediaType(contentType);
                media.setOwner(owner);

                return mediaRepository.save(media);
        }

        public Optional<Media> updateMedia(
                        Long id,
                        Media updatedMedia,
                        String authenticatedEmail) {

                return mediaRepository
                                .findByIdAndOwner_EmailIgnoreCase(
                                                id,
                                                authenticatedEmail.trim())
                                .map(existingMedia -> {
                                        existingMedia.setTitle(
                                                        updatedMedia.getTitle());

                                        existingMedia.setFileName(
                                                        updatedMedia.getFileName());

                                        existingMedia.setFileUrl(
                                                        updatedMedia.getFileUrl());

                                        existingMedia.setMediaType(
                                                        updatedMedia.getMediaType());

                                        return mediaRepository.save(
                                                        existingMedia);
                                });
        }

        public boolean deleteMedia(
                        Long id,
                        String authenticatedEmail) throws IOException {

                Optional<Media> mediaOptional = mediaRepository
                                .findByIdAndOwner_EmailIgnoreCase(
                                                id,
                                                authenticatedEmail.trim());

                if (mediaOptional.isEmpty()) {
                        return false;
                }

                Media media = mediaOptional.get();

                deleteUploadedFile(media);
                mediaRepository.delete(media);

                return true;
        }

        private UserAccount getAuthenticatedUser(
                        String authenticatedEmail) {

                return userAccountRepository
                                .findByEmailIgnoreCase(
                                                authenticatedEmail.trim())
                                .orElseThrow(() -> new IllegalStateException(
                                                "Kullanıcı bulunamadı."));
        }

        private void deleteUploadedFile(
                        Media media) throws IOException {

                String fileUrl = media.getFileUrl();

                if (fileUrl == null
                                || !fileUrl.startsWith(LOCAL_UPLOAD_URL)) {

                        return;
                }

                String storedFileName = fileUrl.substring(
                                LOCAL_UPLOAD_URL.length());

                Path uploadPath = Paths.get(uploadDir)
                                .toAbsolutePath()
                                .normalize();

                Path filePath = uploadPath
                                .resolve(storedFileName)
                                .normalize();

                if (!filePath.startsWith(uploadPath)) {
                        throw new IllegalArgumentException(
                                        "Geçersiz dosya yolu.");
                }

                Files.deleteIfExists(filePath);
        }

        public record StoredMediaFile(
                        Resource resource,
                        String contentType,
                        String originalFileName) {
        }
}