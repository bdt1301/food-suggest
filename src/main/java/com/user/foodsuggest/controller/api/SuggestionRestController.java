package com.user.foodsuggest.controller.api;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
	public ResponseEntity<?> add(@PathVariable Long typeId) {
		var newDish = dishService.addRandomDish(typeId);
		return ResponseEntity.ok(newDish);
	}

	@GetMapping("/{id}/random")
	public ResponseEntity<?> random(@PathVariable Long id) {
		var newDish = dishService.randomDish(id);
		return ResponseEntity.ok(newDish);
	}

	@DeleteMapping("/{id}/remove")
	public ResponseEntity<Void> remove(@PathVariable Long id) {
		dishService.remove(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/eat")
	public ResponseEntity<Void> eat(@PathVariable Long id) {
		dishService.markAsEaten(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/dish-types/{id}")
	public ResponseEntity<Void> edit(@PathVariable Long id, @RequestParam String label) {
		dishTypeService.update(id, label);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/dish-types/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		dishTypeService.delete(id);
		return ResponseEntity.ok().build();
	}
}
