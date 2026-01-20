package com.user.foodsuggest.controller.api;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.cloudinary.Cloudinary;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadRestController {

    private final Cloudinary cloudinary;

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(
            @RequestParam MultipartFile file) throws IOException {

        if (file.getSize() > 2 * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File quá lớn");
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of(
                        "folder", "quill-images",
                        "resource_type", "image",
                        "transformation", "w_800,c_limit,q_auto,f_auto"));

        return ResponseEntity.ok(uploadResult.get("secure_url").toString());
    }

}
