package com.user.foodsuggest.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.user.foodsuggest.model.DishType;

public interface DishTypeRepository extends JpaRepository<DishType, Long> {
    Optional<DishType> findByLabelIgnoreCase(String label);
}
