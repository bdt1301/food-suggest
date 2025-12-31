package com.user.foodsuggest.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.user.foodsuggest.enums.DishType;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.repository.DishRepository;

@Service
public class DishService {

	private final DishRepository dishRepository;

	public DishService(DishRepository dishRepository) {
		this.dishRepository = dishRepository;
	}

	// READ
	public List<Dish> findAll() {
		return dishRepository.findAll();
	}

	public Dish findById(Long id) {
		return dishRepository.findById(id).orElseThrow(() -> new RuntimeException("Dish not found"));
	}

	// CREATE
	public Dish create(Dish dish) {
		return dishRepository.save(dish);
	}

	// UPDATE
	public Dish update(Long id, Dish dish) {
		Dish existing = findById(id);
		existing.setDishName(dish.getDishName());
		existing.setDishType(dish.getDishType());
		existing.setHasEaten(dish.isHasEaten());
		return dishRepository.save(existing);
	}

	// DELETE
	public void delete(Long id) {
		dishRepository.deleteById(id);
	}

	public Map<String, List<Dish>> getSuggestingDishes() {
		return dishRepository.findByHasEatenFalseAndActiveTrue()
				.stream()
				.collect(Collectors.groupingBy(
						d -> d.getDishType().name()));
	}

	public void addRandomDish(DishType dishType) {
		List<Dish> pool = dishRepository.findByDishTypeAndHasEatenFalseAndActiveFalse(dishType);

		if (pool.isEmpty())
			return;

		Dish random = pool.get(new Random().nextInt(pool.size()));
		random.setActive(true);

		dishRepository.save(random);
	}

	public void randomDish(Long id) {
		Dish current = findById(id);
		DishType type = current.getDishType();

		List<Dish> pool = dishRepository.findByDishTypeAndHasEatenFalseAndActiveFalse(type);

		if (pool.isEmpty())
			return;

		Dish random = pool.get(new Random().nextInt(pool.size()));

		current.setActive(false);
		random.setActive(true);

		dishRepository.save(current);
		dishRepository.save(random);
	}

	public void remove(Long id) {
		Dish dish = findById(id);
		dish.setActive(false);
		dishRepository.save(dish);
	}

	public void markAsEaten(Long id) {
		Dish dish = findById(id);
		dish.setHasEaten(true);
		dish.setActive(false);
		dishRepository.save(dish);
	}

	// Đánh dấu tất cả món chưa ăn thành đã ăn
	public void markAllAsEaten() {
		List<Dish> dishes = dishRepository.findByHasEatenFalse();
		for (Dish dish : dishes) {
			dish.setHasEaten(true);
			dish.setActive(false);
		}
		dishRepository.saveAll(dishes);
	}

	// Đánh dấu tất cả món đã ăn thành chưa ăn
	public void markAllAsUneaten() {
		List<Dish> dishes = dishRepository.findByHasEatenTrue();
		for (Dish dish : dishes) {
			dish.setHasEaten(false);
		}
		dishRepository.saveAll(dishes);
	}

}
