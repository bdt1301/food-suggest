package com.user.foodsuggest.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.model.User;

public interface DishRepository extends JpaRepository<Dish, Long> {
	
	Optional<Dish> findByIdAndOwner(Long id, User owner);

	List<Dish> findByOwnerAndDishType(User owner, DishType dishType);

	List<Dish> findByOwnerAndHasEatenTrue(User owner);

	List<Dish> findByOwnerAndHasEatenFalseAndActiveTrue(User owner);

	List<Dish> findByOwnerAndDishTypeAndHasEatenFalseAndActiveFalse(User owner, DishType dishType);

	Page<Dish> findByOwner(User owner, Pageable pageable);

	Page<Dish> findByOwnerAndDishNameContainingIgnoreCase(User owner, String keyword, Pageable pageable);

}
