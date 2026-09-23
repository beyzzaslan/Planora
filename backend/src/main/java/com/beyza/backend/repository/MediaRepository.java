package com.beyza.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.beyza.backend.entity.Media;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

        List<Media> findAllByOwner_EmailIgnoreCaseOrderByIdDesc(
                        String email);

        Optional<Media> findByIdAndOwner_EmailIgnoreCase(
                        Long id,
                        String email);
}