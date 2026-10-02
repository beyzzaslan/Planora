package com.beyza.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beyza.backend.dto.auth.ForgotPasswordRequest;
import com.beyza.backend.dto.auth.ResetPasswordRequest;
import com.beyza.backend.entity.PasswordResetToken;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.PasswordResetTokenRepository;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int TOKEN_BYTE_LENGTH = 32;

    private final PasswordResetTokenRepository tokenRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.password-reset.url}")
    private String passwordResetUrl;

    @Value("${app.password-reset.expiration-minutes}")
    private long expirationMinutes;

    @Transactional
    public void requestPasswordReset(
            ForgotPasswordRequest request) {

        String normalizedEmail = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        UserAccount user = userAccountRepository
                .findByEmailIgnoreCase(normalizedEmail)
                .orElse(null);

        /*
         * E-posta kayıtlı değilse de hata vermiyoruz.
         * Böylece dışarıdan bir kişi hangi e-postaların
         * sistemde kayıtlı olduğunu anlayamaz.
         */
        if (user == null) {
            return;
        }

        tokenRepository.deleteAllByUser(user);

        String rawToken = generateToken();

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setUser(user);
        resetToken.setTokenHash(hashToken(rawToken));
        resetToken.setExpiresAt(
                Instant.now().plus(
                        expirationMinutes,
                        ChronoUnit.MINUTES));

        tokenRepository.save(resetToken);

        sendPasswordResetEmail(
                user.getEmail(),
                user.getName(),
                rawToken);
    }

    @Transactional
    public void resetPassword(
            ResetPasswordRequest request) {

        String tokenHash = hashToken(
                request.token().trim());

        PasswordResetToken resetToken = tokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() ->
                        invalidTokenException());

        if (resetToken.isUsed()
                || resetToken.isExpired()) {

            throw invalidTokenException();
        }

        if (!request.newPassword().equals(
                request.confirmPassword())) {

            throw new IllegalArgumentException(
                    "Yeni şifreler eşleşmiyor.");
        }

        UserAccount user = resetToken.getUser();

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.newPassword()));

        resetToken.setUsedAt(Instant.now());

        userAccountRepository.save(user);
        tokenRepository.save(resetToken);
    }

    private String generateToken() {
        byte[] randomBytes =
                new byte[TOKEN_BYTE_LENGTH];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    rawToken.getBytes(
                            StandardCharsets.UTF_8));

            return HexFormat.of()
                    .formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "Token güvenli şekilde işlenemedi.",
                    exception);
        }
    }

    private void sendPasswordResetEmail(
            String recipientEmail,
            String recipientName,
            String rawToken) {

        String resetLink = passwordResetUrl
                + "?token="
                + rawToken;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipientEmail);
        message.setSubject(
                "Planora şifre sıfırlama bağlantısı");

        message.setText(
                "Merhaba " + recipientName + ",\n\n"
                + "Planora hesabının şifresini sıfırlamak "
                + "için aşağıdaki bağlantıyı aç:\n\n"
                + resetLink + "\n\n"
                + "Bu bağlantı "
                + expirationMinutes
                + " dakika boyunca geçerlidir.\n\n"
                + "Bu isteği sen yapmadıysan "
                + "bu e-postayı görmezden gelebilirsin.");

        mailSender.send(message);
    }

    private IllegalArgumentException
            invalidTokenException() {

        return new IllegalArgumentException(
                "Şifre sıfırlama bağlantısı "
                + "geçersiz, kullanılmış veya süresi dolmuş.");
    }
}