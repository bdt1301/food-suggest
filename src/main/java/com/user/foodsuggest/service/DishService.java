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
	@Transactional
	public Dish update(Long id, Dish dish) {
		Dish existing = findById(id);

		DishType persistentType = dishTypeRepository
				.findById(dish.getDishType().getId())
				.orElseThrow(() -> new RuntimeException("DishType not found"));

		existing.setDishName(dish.getDishName());
		existing.setDishType(persistentType);
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

	public Dish addRandomDish(Long dishTypeId) {
		DishType type = dishTypeRepository.findById(dishTypeId)
				.orElseThrow(() -> new EntityNotFoundException("DishType not found"));

		List<Dish> pool = dishRepository.findByDishTypeAndHasEatenFalseAndActiveFalse(type);

		if (pool.isEmpty())
			return null;

		Dish random = pool.get(new Random().nextInt(pool.size()));
		random.setActive(true);

		return dishRepository.save(random);
	}

	public Dish randomDish(Long id) {
		Dish current = findById(id);
		DishType type = current.getDishType();

		List<Dish> pool = dishRepository.findByDishTypeAndHasEatenFalseAndActiveFalse(type);

		if (pool.isEmpty())
			return null;

		Dish random = pool.get(new Random().nextInt(pool.size()));

		current.setActive(false);
		random.setActive(true);

		dishRepository.save(current);
		return dishRepository.save(random);
	}

	public void remove(Long id) {
		Dish dish = findById(id);
		dish.setActive(false);
		dishRepository.save(dish);
	}

	public Dish markAsEaten(Long id) {
		Dish dish = findById(id);
		dish.setHasEaten(true);
		dish.setActive(false);
		return dishRepository.save(dish);
	}

	// Đánh dấu tất cả món đã ăn thành chưa ăn
	public void markAllAsUneaten() {
		List<Dish> dishes = dishRepository.findByHasEatenTrue();
		for (Dish dish : dishes) {
			dish.setHasEaten(false);
		}
		dishRepository.saveAll(dishes);
	}

	@Transactional
	public boolean resetIfAllEatenByDishType(DishType type) {
		List<Dish> dishes = dishRepository.findByDishType(type);

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

}
