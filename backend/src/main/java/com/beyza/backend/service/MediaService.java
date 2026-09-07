package com.beyza.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.beyza.backend.entity.Media;
import com.beyza.backend.repository.MediaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    public Optional<Media> getMediaById(Long id) {
        return mediaRepository.findById(id);
    }

    public Media createMedia(Media media) {
        return mediaRepository.save(media);
    }

    public Optional<Media> updateMedia(Long id, Media updatedMedia) {
        return mediaRepository.findById(id).map(existing -> {
            existing.setTitle(updatedMedia.getTitle());
            existing.setFileName(updatedMedia.getFileName());
            existing.setFileUrl(updatedMedia.getFileUrl());
            existing.setMediaType(updatedMedia.getMediaType());
            return mediaRepository.save(existing);

        });
    }

    public boolean deleteMedia(Long id) {
        if (!mediaRepository.existsById(id)) {
            return false;
        }
        mediaRepository.deleteById(id);
        return true;
    }
}