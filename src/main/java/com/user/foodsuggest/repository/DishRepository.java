package com.user.foodsuggest.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.user.foodsuggest.enums.Visibility;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.model.User;

public interface DishRepository extends JpaRepository<Dish, Long> {

    boolean existsByOwnerAndDishNameIgnoreCase(User owner, String dishName);

    boolean existsByOwnerAndDishNameIgnoreCaseAndIdNot(User owner, String dishName, Long id);

    Optional<Dish> findByIdAndOwner(Long id, User owner);

    List<Dish> findByOwnerAndDishType(User owner, DishType dishType);

    List<Dish> findByOwnerAndHasEatenTrue(User owner);

    List<Dish> findByOwnerAndHasEatenFalseAndActiveTrue(User owner);

    List<Dish> findByOwnerAndDishTypeAndHasEatenFalseAndActiveFalse(User owner, DishType dishType);

    Page<Dish> findByOwner(User owner, Pageable pageable);

    Page<Dish> findByOwnerAndDishNameContainingIgnoreCase(User owner, String keyword, Pageable pageable);

    Page<Dish> findByVisibility(Visibility visibility, Pageable pageable);

    Page<Dish> findByVisibilityAndDishNameContainingIgnoreCase(Visibility visibility, String dishName,
            Pageable pageable);

    Optional<Dish> findByIdAndVisibility(Long id, Visibility visibility);

}
