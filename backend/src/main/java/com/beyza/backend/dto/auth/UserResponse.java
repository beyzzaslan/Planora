package com.beyza.backend.dto.auth;

import com.beyza.backend.entity.UserAccount;

public record UserResponse(
        Long id,
        String name,
        String email,
        String focus,
        String avatarUrl) {

    public static UserResponse from(UserAccount user) {
        String avatarUrl = user.getAvatarFileName() == null
                ? null
                : "/profile/avatar";

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getFocus(),
                avatarUrl);
    }
}