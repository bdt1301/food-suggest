package com.user.foodsuggest.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.model.User;
import com.user.foodsuggest.repository.DishTypeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DishTypeService {

    private final DishTypeRepository dishTypeRepository;
    private final UserService userService;

    // ===== READ =====
    public List<DishType> findAll() {
        User user = userService.getCurrentUser();
        return dishTypeRepository.findByUser(user);
    }

    // ===== CREATE =====
    @Transactional
    public DishType createIfNotExists(String label) {
        User user = userService.getCurrentUser();
        String normalized = label.trim();

        if (normalized.isEmpty()) {
            throw new RuntimeException("Tên loại món không hợp lệ");
        }

        return dishTypeRepository
                .findByLabelIgnoreCaseAndUser(normalized, user)
                .orElseGet(() -> {
                    DishType type = new DishType();
                    type.setLabel(normalized);
                    type.setUser(user);
                    return dishTypeRepository.save(type);
                });
    }

    // ===== UPDATE =====
    @Transactional
    public DishType update(Long id, String label) {
        User user = userService.getCurrentUser();

        DishType type = dishTypeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Không có quyền sửa DishType này"));

        type.setLabel(label);
        return type;
    }

    // ===== DELETE =====
    public void delete(Long id) {
        User user = userService.getCurrentUser();

        DishType type = dishTypeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Không có quyền xóa DishType này"));

        dishTypeRepository.delete(type);
    }

}
