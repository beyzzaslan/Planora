package com.beyza.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beyza.backend.dto.auth.UserResponse;
import com.beyza.backend.dto.profile.UpdateProfileRequest;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserAccountRepository userAccountRepository;

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
}