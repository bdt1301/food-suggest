package com.user.foodsuggest.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.repository.DishRepository;
import com.user.foodsuggest.repository.DishTypeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class DishService {

	private final DishRepository dishRepository;
	private final DishTypeRepository dishTypeRepository;

	public DishService(DishRepository dishRepository, DishTypeRepository dishTypeRepository) {
		this.dishRepository = dishRepository;
		this.dishTypeRepository = dishTypeRepository;
	}

	// READ
	public List<Dish> findAll() {
		return dishRepository.findAll(Sort.by("id"));
	}

	public Dish findById(Long id) {
		return dishRepository.findById(id).orElseThrow(() -> new RuntimeException("Dish not found"));
	}

	// CREATE
	@Transactional
	public Dish create(Dish dish) {
		// 1. Kiểm tra xem người dùng có chọn loại món không
		if (dish.getDishType() == null || dish.getDishType().getId() == null) {
			throw new IllegalArgumentException("Loại món là bắt buộc");
		}

		// 2. Tìm kiếm DishType thực sự từ Database
		Long typeId = dish.getDishType().getId();
		DishType persistentType = dishTypeRepository.findById(typeId)
				.orElseThrow(() -> new RuntimeException("Loại món ID " + typeId + " không tồn tại"));

		// 3. Thiết lập mối quan hệ và lưu
		dish.setDishType(persistentType);
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

	public Map<Long, List<Dish>> getSuggestingDishes() {
		return dishRepository.findByHasEatenFalseAndActiveTrue()
				.stream()
				.collect(Collectors.groupingBy(
						dish -> dish.getDishType().getId()));
	}

	public void addRandomDish(Long dishTypeId) {
		DishType type = dishTypeRepository.findById(dishTypeId)
				.orElseThrow(() -> new EntityNotFoundException("DishType not found"));

		List<Dish> pool = dishRepository.findByDishTypeAndHasEatenFalseAndActiveFalse(type);

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
