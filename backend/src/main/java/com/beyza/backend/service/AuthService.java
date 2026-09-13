package com.beyza.backend.service;

import java.util.Locale;
import java.util.Objects;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beyza.backend.dto.auth.RegisterRequest;
import com.beyza.backend.dto.auth.UserResponse;
import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserAccountRepository userAccountRepository;
        private final PasswordEncoder passwordEncoder;

        @Transactional
        public UserResponse register(RegisterRequest request) {
                if (!Objects.equals(
                                request.password(),
                                request.confirmPassword())) {

                        throw new IllegalArgumentException(
                                        "Şifre ve şifre tekrarı eşleşmiyor.");
                }

                String normalizedEmail = request.email()
                                .trim()
                                .toLowerCase(Locale.ROOT);

                if (userAccountRepository
                                .existsByEmailIgnoreCase(normalizedEmail)) {

                        throw new IllegalStateException(
                                        "Bu e-posta adresi zaten kullanılıyor.");
                }

                UserAccount user = new UserAccount();

                user.setName(request.name().trim());
                user.setEmail(normalizedEmail);
                user.setPasswordHash(
                                passwordEncoder.encode(request.password()));
                user.setFocus("Daily");
                user.setAvatarUrl(null);

                UserAccount savedUser = userAccountRepository.save(user);

                return UserResponse.from(savedUser);
        }

        @Transactional(readOnly = true)
        public UserResponse getUserByEmail(String email) {

                UserAccount user = userAccountRepository
                                .findByEmailIgnoreCase(email.trim())
                                .orElseThrow(() -> new IllegalStateException(
                                                "Kullanıcı bulunamadı."));

                return UserResponse.from(user);
                // bu metodu başarılı girişten sonra kullanıcının profil bilgilerini cevap
                // olarak göndermek için kullanacağız.
        }
}
