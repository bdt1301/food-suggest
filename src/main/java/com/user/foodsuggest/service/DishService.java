package com.user.foodsuggest.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.model.User;
import com.user.foodsuggest.repository.DishRepository;
import com.user.foodsuggest.repository.DishTypeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DishService {

    private final DishRepository dishRepository;
    private final DishTypeRepository dishTypeRepository;
    private final UserService userService;

    // READ
    public Dish findOwnedDish(Long id) {
        User user = userService.getCurrentUser();
        return dishRepository.findByIdAndOwner(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Dish not found"));
    }

    // SEARCH
    public Page<Dish> search(String keyword, Pageable pageable) {
        User user = userService.getCurrentUser();

        if (keyword == null || keyword.isBlank()) {
            return dishRepository.findByOwner(user, pageable);
        }

        return dishRepository
                .findByOwnerAndDishNameContainingIgnoreCase(
                        user, keyword.trim(), pageable);
    }

    // CREATE
    @Transactional
    public Dish create(Dish dish) {

        if (dish.getDishType() == null || dish.getDishType().getId() == null) {
            throw new IllegalArgumentException("DishType is required");
        }

        DishType persistentType = dishTypeRepository
                .findById(dish.getDishType().getId())
                .orElseThrow(() -> new RuntimeException("DishType not found"));

        User currentUser = userService.getCurrentUser();

        String name = dish.getDishName().trim();
        if (dishRepository.existsByOwnerAndDishNameIgnoreCase(currentUser, name)) {
            throw new IllegalArgumentException("Tên món ăn đã tồn tại");
        }

        dish.setDishName(name);
        dish.setDishType(persistentType);
        dish.setOwner(currentUser);

        return dishRepository.save(dish);
    }

    // UPDATE
    @Transactional
    public Dish update(Long id, Dish dish) {
        Dish existing = findOwnedDish(id);
        User currentUser = userService.getCurrentUser();

        DishType type = dishTypeRepository
                .findById(dish.getDishType().getId())
                .orElseThrow();

        String name = dish.getDishName().trim();
        if (dishRepository.existsByOwnerAndDishNameIgnoreCaseAndIdNot(currentUser, name, id)) {
            throw new IllegalArgumentException("Tên món ăn đã tồn tại");
        }

        existing.setDishName(name);
        existing.setDishType(type);
        existing.setHasEaten(dish.isHasEaten());

        return existing;
    }

    // DELETE
    public void delete(Long id) {
        Dish existing = findOwnedDish(id);
        dishRepository.delete(existing);
    }

    public Map<Long, List<Dish>> getSuggestingDishes() {
        User user = userService.getCurrentUser();

        return dishRepository
                .findByOwnerAndHasEatenFalseAndActiveTrue(user)
                .stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDishType().getId()));
    }

    public Dish addRandomDish(Long dishTypeId) {
        User user = userService.getCurrentUser();

        DishType type = dishTypeRepository.findById(dishTypeId)
                .orElseThrow(() -> new EntityNotFoundException("DishType not found"));

        List<Dish> pool = dishRepository.findByOwnerAndDishTypeAndHasEatenFalseAndActiveFalse(user, type);

        if (pool.isEmpty())
            return null;

        Dish random = pool.get(new Random().nextInt(pool.size()));
        random.setActive(true);

        return dishRepository.save(random);
    }

    public Dish randomDish(Long id) {
        User user = userService.getCurrentUser();

        Dish current = findOwnedDish(id);
        DishType type = current.getDishType();

        List<Dish> pool = dishRepository.findByOwnerAndDishTypeAndHasEatenFalseAndActiveFalse(user, type);

        if (pool.isEmpty())
            return null;

        Dish random = pool.get(new Random().nextInt(pool.size()));

        current.setActive(false);
        random.setActive(true);

        dishRepository.save(current);
        return dishRepository.save(random);
    }

    public void remove(Long id) {
        Dish dish = findOwnedDish(id);
        dish.setActive(false);
        dishRepository.save(dish);
    }

    public Dish markAsEaten(Long id) {
        Dish dish = findOwnedDish(id);
        dish.setHasEaten(true);
        dish.setActive(false);
        return dishRepository.save(dish);
    }

    // Đánh dấu tất cả món đã ăn thành chưa ăn
    public void markAllAsUneaten() {
        User user = userService.getCurrentUser();

        List<Dish> dishes = dishRepository.findByOwnerAndHasEatenTrue(user);
        for (Dish dish : dishes) {
            dish.setHasEaten(false);
        }
        dishRepository.saveAll(dishes);
    }

    @Transactional
    public boolean resetIfAllEatenByDishType(DishType type) {
        User user = userService.getCurrentUser();

        List<Dish> dishes = dishRepository.findByOwnerAndDishType(user, type);

        if (dishes.isEmpty())
            return false;

        boolean allEaten = dishes.stream()
                .allMatch(Dish::isHasEaten);

        if (allEaten) {
            dishes.forEach(d -> d.setHasEaten(false));
            dishRepository.saveAll(dishes);
            return true;
        }

        return false;
    }

    @Transactional
    public void updateNote(Long dishId, String note) {
        Dish dish = findOwnedDish(dishId);
        dish.setNote(note);
    }

}
