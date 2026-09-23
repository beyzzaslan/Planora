package com.beyza.backend.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserAccount owner;
    @Setter
    private String content;

    @Setter
    private String color = "#F9A8D4";

    @Setter
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @Setter
    private LocalDate taskDate;

    @Setter
    private LocalTime taskTime;

    @Setter
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.ACTIVE;

    @Setter
    private Boolean reminderEnabled = false;

    @Setter
    private Integer reminderOffset;
}