package com.beyza.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beyza.backend.dto.auth.RegisterRequest;
import com.beyza.backend.dto.auth.UserResponse;
import com.beyza.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {
            UserResponse registeredUser = authService.register(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(registeredUser);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            exception.getMessage()));

        } catch (IllegalStateException exception) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            exception.getMessage()));
        }
    }
}