package com.user.foodsuggest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.service.DishService;
import com.user.foodsuggest.service.DishTypeService;

@Controller
@RequestMapping("/dishes")
public class DishController {

	private final DishService dishService;
	private final DishTypeService dishTypeService;

	public DishController(DishService dishService, DishTypeService dishTypeService) {
		this.dishService = dishService;
		this.dishTypeService = dishTypeService;
	}

	@GetMapping
	public String list(Model model) {
		model.addAttribute("dishes", dishService.findAll());
		return "dishes";
	}

	@PostMapping
	public String create(@ModelAttribute Dish dish) {
		dishService.create(dish);
		return "redirect:/dishes";
	}

	@PostMapping("/{id}")
	public String update(@PathVariable Long id, @ModelAttribute Dish dish,
			@RequestParam(required = false) String newDishTypeLabel) {
		dishService.update(id, dish);
		return "redirect:/dishes";
	}

	@GetMapping("/{id}/delete")
	public String delete(@PathVariable Long id) {
		dishService.delete(id);
		return "redirect:/dishes";
	}

	@GetMapping("/mark-all-eaten")
	public String markAllEaten() {
		dishService.markAllAsEaten();
		return "redirect:/dishes";
	}

	@GetMapping("/mark-all-uneaten")
	public String markAllUneaten() {
		dishService.markAllAsUneaten();
		return "redirect:/dishes";
	}

	@GetMapping("/modal")
	public String dishModal(
			@RequestParam(required = false) Long id,
			Model model) {
		Dish dish = (id != null)
				? dishService.findById(id)
				: new Dish();

		model.addAttribute("dish", dish);
		model.addAttribute("dishTypes", dishTypeService.findAll());

		return "fragments/dish-form :: form";
	}

}
