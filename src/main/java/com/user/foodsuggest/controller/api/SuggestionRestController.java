package com.user.foodsuggest.controller.api;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.service.DishService;
import com.user.foodsuggest.service.DishTypeService;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionRestController {

	private final DishService dishService;
	private final DishTypeService dishTypeService;

	public SuggestionRestController(DishService dishService, DishTypeService dishTypeService) {
		this.dishService = dishService;
		this.dishTypeService = dishTypeService;
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> getAllData() {
		Map<String, Object> response = new HashMap<>();
		response.put("dishTypes", dishTypeService.findAll());
		response.put("groups", dishService.getSuggestingDishes());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/add/{typeId}")
	public ResponseEntity<Dish> add(@PathVariable Long typeId) {
		var newDish = dishService.addRandomDish(typeId);
		return ResponseEntity.ok(newDish);
	}

	@PostMapping("/{id}/random")
	public ResponseEntity<Dish> random(@PathVariable Long id) {
		var newDish = dishService.randomDish(id);
		return ResponseEntity.ok(newDish);
	}

	@PostMapping("/{id}/eat")
	public ResponseEntity<?> eat(@PathVariable Long id) {
		Dish eatenDish = dishService.markAsEaten(id);

		boolean reset = dishService
				.resetIfAllEatenByDishType(eatenDish.getDishType());

		return ResponseEntity.ok(Map.of(
				"resetPerformed", reset));
	}

	@DeleteMapping("/{id}/remove")
	public ResponseEntity<Void> remove(@PathVariable Long id) {
		dishService.remove(id);
		return ResponseEntity.ok().build();
	}

}
