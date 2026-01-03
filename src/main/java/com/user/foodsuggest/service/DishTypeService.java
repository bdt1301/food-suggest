package com.user.foodsuggest.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.repository.DishTypeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class DishTypeService {

    private final DishTypeRepository dishTypeRepository;

    public DishTypeService(DishTypeRepository dishTypeRepository) {
        this.dishTypeRepository = dishTypeRepository;
    }

    // ===== READ =====
    public List<DishType> findAll() {
        return dishTypeRepository.findAll();
    }

    public DishType findById(Long id) {
        return dishTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("DishType not found: " + id));
    }

    // ===== CREATE =====
    public DishType create(DishType dishType) {
        return dishTypeRepository.save(dishType);
    }

    // ===== UPDATE =====
    @Transactional
    public void update(Long id, String label) {
        DishType type = dishTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("DishType not found: " + id));
        type.setLabel(label);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        dishTypeRepository.deleteById(id);
    }

    @Transactional
    public DishType createIfNotExists(String label) {
        String normalized = label.trim();

        if (normalized.isEmpty()) {
            throw new RuntimeException("Tên loại món không hợp lệ");
        }

        return dishTypeRepository.findByLabelIgnoreCase(normalized)
                .orElseGet(() -> {
                    DishType type = new DishType();
                    type.setLabel(normalized);
                    return dishTypeRepository.save(type);
                });
    }
}
