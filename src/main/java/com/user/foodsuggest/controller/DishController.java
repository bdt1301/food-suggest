package com.user.foodsuggest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.enums.DishType;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.service.DishService;

@Controller
@RequestMapping("/dishes")
public class DishController {

	private final DishService dishService;

	public DishController(DishService dishService) {
		this.dishService = dishService;
	}

	@GetMapping
	public String list(Model model) {
		model.addAttribute("dishes", dishService.findAll());
		return "dishes";
	}

	@GetMapping("/new")
	public String createForm(Model model) {
		model.addAttribute("dish", new Dish());
		model.addAttribute("dishTypes", DishType.values());
		return "dish-form";
	}

	@PostMapping
	public String create(@ModelAttribute Dish dish) {
		dishService.create(dish);
		return "redirect:/dishes";
	}

	@GetMapping("/{id}/edit")
	public String editForm(@PathVariable Long id, Model model) {
		model.addAttribute("dish", dishService.findById(id));
		model.addAttribute("dishTypes", DishType.values());
		return "dish-form";
	}

	@PostMapping("/{id}")
	public String update(@PathVariable Long id, @ModelAttribute Dish dish) {
		dishService.update(id, dish);
		return "redirect:/dishes";
	}

	@GetMapping("/{id}/delete")
	public String delete(@PathVariable Long id) {
		dishService.delete(id);
		return "redirect:/dishes";
	}

	@GetMapping("/{id}/toggle")
	public String markAsEaten(@PathVariable Long id) {
		dishService.markAsEaten(id);
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
		model.addAttribute("dishTypes", DishType.values());

		return "fragments/dish-form :: form";
	}

}
