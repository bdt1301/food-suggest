package com.user.foodsuggest.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.user.foodsuggest.dto.CloneDishDTO;
import com.user.foodsuggest.dto.CommunityDishDTO;
import com.user.foodsuggest.enums.Visibility;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.model.User;
import com.user.foodsuggest.repository.DishRepository;
import com.user.foodsuggest.repository.DishTypeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CommunityService {

    private final DishRepository dishRepository;
    private final DishTypeRepository dishTypeRepository;
    private final UserService userService;

    public Page<Dish> getPublicDishes(Pageable pageable) {
        return dishRepository.findByVisibility(
                Visibility.PUBLIC, pageable);
    }

    public Page<CommunityDishDTO> searchPublicDishes(
            String keyword,
            Pageable pageable) {
        User currentUser = userService.getCurrentUserOptional().orElse(null);

        Page<Dish> page;

        if (keyword == null || keyword.isBlank()) {
            page = dishRepository.findByVisibility(Visibility.PUBLIC, pageable);
        } else {
            page = dishRepository.findByVisibilityAndDishNameContainingIgnoreCase(Visibility.PUBLIC, keyword.trim(),
                    pageable);
        }

        return page.map(dish -> new CommunityDishDTO(dish.getId(), dish.getDishName(), dish.getNote(),
                dish.getOwner().getUsername(),
                currentUser != null && dish.getOwner().getId().equals(currentUser.getId()), currentUser != null));
    }

    public CommunityDishDTO findPublicDish(Long id) {
        Dish dish = dishRepository.findByIdAndVisibility(id, Visibility.PUBLIC)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Món ăn không tồn tại hoặc không được chia sẻ"));

        User currentUser = userService.getCurrentUser();
        boolean isOwner = currentUser != null && dish.getOwner().getId().equals(currentUser.getId());

        return new CommunityDishDTO(dish.getId(), dish.getDishName(), dish.getNote(), dish.getOwner().getUsername(),
                isOwner, currentUser != null);
    }

    @Transactional
    public Dish cloneDish(CloneDishDTO dto) {
        User currentUser = userService.getCurrentUser();

        Dish source = dishRepository.findById(dto.getSourceDishId())
                .orElseThrow(() -> new IllegalArgumentException("Source dish not found"));

        // Chỉ cho clone món PUBLIC
        if (source.getVisibility() != Visibility.PUBLIC) {
            throw new IllegalArgumentException("Dish is not public");
        }

        // Không cho clone món của chính mình
        if (source.getOwner().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Cannot clone your own dish");
        }

        DishType dishType = dishTypeRepository
                .findById(dto.getDishTypeId())
                .orElseThrow(() -> new IllegalArgumentException("DishType not found"));

        // Check trùng tên trong danh sách cá nhân
        String name = dto.getDishName().trim();
        if (dishRepository.existsByOwnerAndDishNameIgnoreCase(currentUser, name)) {
            throw new IllegalArgumentException("Tên món ăn đã tồn tại");
        }

        Dish dish = new Dish();
        dish.setDishName(name);
        dish.setDishType(dishType);
        dish.setOwner(currentUser);

        // Clone về luôn là món riêng
        dish.setHasEaten(false);
        dish.setActive(false);
        dish.setVisibility(Visibility.PRIVATE);
        dish.setNote(source.getNote());

        return dishRepository.save(dish);
    }

}
