package com.user.foodsuggest.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.model.User;

public interface DishTypeRepository extends JpaRepository<DishType, Long> {
    Optional<DishType> findByIdAndUser(Long id, User user);

    List<DishType> findByUser(User user);

    Optional<DishType> findByLabelIgnoreCaseAndUser(String label, User user);
}
