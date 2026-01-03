package com.user.foodsuggest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;

public interface DishRepository extends JpaRepository<Dish, Long> {
	List<Dish> findByHasEatenFalse();

	List<Dish> findByHasEatenTrue();

	List<Dish> findByHasEatenFalseAndActiveTrue();

	List<Dish> findByDishTypeAndHasEatenFalseAndActiveFalse(DishType dishType);
}
