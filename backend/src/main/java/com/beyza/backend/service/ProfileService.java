package com.beyza.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.beyza.backend.dto.auth.UserResponse;
import com.beyza.backend.dto.profile.UpdateProfileRequest;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class ProfileService {

private static final long MAX_AVATAR_SIZE = 5 * 1024 * 1024;

private final UserAccountRepository userAccountRepository;

@Value("${app.avatar.upload-dir}")
private String avatarUploadDir;


    @Transactional
    public UserResponse updateProfile(
            String authenticatedEmail,
            UpdateProfileRequest request) {

        UserAccount user = userAccountRepository
                .findByEmailIgnoreCase(authenticatedEmail)
                .orElseThrow(() -> new IllegalStateException(
                        "Kullanıcı bulunamadı."));

        user.setName(request.name().trim());
        user.setFocus(request.focus().trim());

        UserAccount updatedUser = userAccountRepository.save(user);

        return UserResponse.from(updatedUser);
    }

    @Transactional
    public UserResponse uploadAvatar(
        String authenticatedEmail,
        MultipartFile file) throws IOException {

    if (file.isEmpty()) {
        throw new IllegalArgumentException(
                "Avatar dosyası boş olamaz.");
    }

    if (file.getSize() > MAX_AVATAR_SIZE) {
        throw new IllegalArgumentException(
                "Avatar en fazla 5 MB olabilir.");
    }

    String originalFileName = file.getOriginalFilename();

    if (originalFileName == null
            || originalFileName.isBlank()) {

        throw new IllegalArgumentException(
                "Dosya adı bulunamadı.");
    }

    String lowerFileName = originalFileName
            .toLowerCase(Locale.ROOT);

    String extension;
    String expectedContentType;

    if (lowerFileName.endsWith(".jpg")
            || lowerFileName.endsWith(".jpeg")) {

        extension = ".jpg";
        expectedContentType = "image/jpeg";

    } else if (lowerFileName.endsWith(".png")) {

        extension = ".png";
        expectedContentType = "image/png";

    } else if (lowerFileName.endsWith(".webp")) {

        extension = ".webp";
        expectedContentType = "image/webp";

    } else {
        throw new IllegalArgumentException(
                "Avatar yalnızca JPG, PNG veya WebP olabilir.");
    }

    if (!expectedContentType.equals(file.getContentType())) {
        throw new IllegalArgumentException(
                "Dosyanın türü ile uzantısı uyuşmuyor.");
    }

    UserAccount user = userAccountRepository
            .findByEmailIgnoreCase(authenticatedEmail.trim())
            .orElseThrow(() -> new IllegalStateException(
                    "Kullanıcı bulunamadı."));

    String storedFileName = UUID.randomUUID() + extension;

    Path uploadPath = Paths.get(avatarUploadDir)
            .toAbsolutePath()
            .normalize();

    Files.createDirectories(uploadPath);

    Path targetPath = uploadPath
            .resolve(storedFileName)
            .normalize();

    if (!targetPath.startsWith(uploadPath)) {
        throw new IllegalArgumentException(
                "Geçersiz avatar dosya yolu.");
    }

    Files.copy(
            file.getInputStream(),
            targetPath,
            StandardCopyOption.REPLACE_EXISTING);

    String oldAvatarFileName = user.getAvatarFileName();

    user.setAvatarFileName(storedFileName);

    UserAccount updatedUser =
            userAccountRepository.save(user);

    deleteOldAvatar(
            oldAvatarFileName,
            storedFileName,
            uploadPath);

    return UserResponse.from(updatedUser);
}

@Transactional(readOnly = true)
public Optional<AvatarFile> getAvatar(
        String authenticatedEmail) throws IOException {

    UserAccount user = userAccountRepository
            .findByEmailIgnoreCase(authenticatedEmail.trim())
            .orElseThrow(() -> new IllegalStateException(
                    "Kullanıcı bulunamadı."));

    String avatarFileName = user.getAvatarFileName();

    if (avatarFileName == null
            || avatarFileName.isBlank()) {

        return Optional.empty();
    }

    Path uploadPath = Paths.get(avatarUploadDir)
            .toAbsolutePath()
            .normalize();

    Path avatarPath = uploadPath
            .resolve(avatarFileName)
            .normalize();

    if (!avatarPath.startsWith(uploadPath)
            || !Files.isRegularFile(avatarPath)) {

        return Optional.empty();
    }

    Resource resource = new UrlResource(
            avatarPath.toUri());

    if (!resource.isReadable()) {
        return Optional.empty();
    }

    String contentType = Files.probeContentType(
            avatarPath);

    if (contentType == null) {
        contentType = "application/octet-stream";
    }

    return Optional.of(
            new AvatarFile(resource, contentType));
}
    private void deleteOldAvatar(
        String oldAvatarFileName,
        String newAvatarFileName,
        Path uploadPath) throws IOException {

    if (oldAvatarFileName == null
            || oldAvatarFileName.isBlank()
            || oldAvatarFileName.equals(newAvatarFileName)) {

        return;
    }

    Path oldAvatarPath = uploadPath
            .resolve(oldAvatarFileName)
            .normalize();

    if (!oldAvatarPath.startsWith(uploadPath)) {
        throw new IllegalArgumentException(
                "Geçersiz eski avatar dosya yolu.");
    }

    Files.deleteIfExists(oldAvatarPath);
}
public record AvatarFile(
        Resource resource,
        String contentType) {
}
}