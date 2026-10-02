package com.beyza.backend.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.beyza.backend.entity.PasswordResetToken;
import com.beyza.backend.entity.UserAccount;

import jakarta.persistence.LockModeType;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PasswordResetToken> findByTokenHash(
            String tokenHash);

    void deleteAllByUser(
            UserAccount user);

    void deleteAllByExpiresAtBefore(
            Instant dateTime);
}