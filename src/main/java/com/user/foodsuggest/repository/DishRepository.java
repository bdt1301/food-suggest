package com.user.foodsuggest.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;

public interface DishRepository extends JpaRepository<Dish, Long> {
	List<Dish> findByDishType(DishType dishType);

	List<Dish> findByHasEatenFalse();

	List<Dish> findByHasEatenTrue();

	List<Dish> findByHasEatenFalseAndActiveTrue();

	List<Dish> findByDishTypeAndHasEatenFalseAndActiveFalse(DishType dishType);

	Page<Dish> findByDishNameContainingIgnoreCase(String keyword, Pageable pageable);

}
