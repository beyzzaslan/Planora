package com.beyza.backend.controller;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.beyza.backend.dto.auth.UserResponse;
import com.beyza.backend.dto.profile.UpdateProfileRequest;
import com.beyza.backend.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserResponse updatedUser = profileService.updateProfile(
                userDetails.getUsername(),
                request);

        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping(
            value = "/avatar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        UserResponse updatedUser
                = profileService.uploadAvatar(
                        userDetails.getUsername(),
                        file);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/avatar")
    public ResponseEntity<?> getAvatar(
            @AuthenticationPrincipal UserDetails userDetails)
            throws IOException {

        Optional<ProfileService.AvatarFile> avatarOptional
                = profileService.getAvatar(
                        userDetails.getUsername());

        if (avatarOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProfileService.AvatarFile avatar
                = avatarOptional.get();

        return ResponseEntity
                .ok()
                .contentType(
                        MediaType.parseMediaType(
                                avatar.contentType()))
                .body(avatar.resource());
    }
}
