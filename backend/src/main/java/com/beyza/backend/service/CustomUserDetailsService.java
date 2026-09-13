package com.beyza.backend.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.beyza.backend.entity.UserAccount;
import com.beyza.backend.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserAccountRepository userAccountRepository;

        @Override
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                UserAccount user = userAccountRepository
                                .findByEmailIgnoreCase(email.trim())
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "Bu e-posta adresine ait kullanıcı bulunamadı."));

                return User.withUsername(user.getEmail())
                                .password(user.getPasswordHash())
                                .roles("USER")
                                .build();
        }
}