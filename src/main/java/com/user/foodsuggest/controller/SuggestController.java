package com.user.foodsuggest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.service.DishService;
import com.user.foodsuggest.service.DishTypeService;

@Controller
@RequestMapping("/")
public class SuggestController {

	private final DishService dishService;
	private final DishTypeService dishTypeService;

	public SuggestController(DishService dishService, DishTypeService dishTypeService) {
		this.dishService = dishService;
		this.dishTypeService = dishTypeService;
	}

	@GetMapping
	public String suggest(Model model) {
		model.addAttribute("dishTypes", dishTypeService.findAll());
		model.addAttribute("groups", dishService.getSuggestingDishes());
		return "index";
	}

	@GetMapping("/add/{typeId}")
	public String add(@PathVariable Long typeId) {
		dishService.addRandomDish(typeId);
		return "redirect:/";
	}

	@GetMapping("/{id}/random")
	public String random(@PathVariable Long id) {
		dishService.randomDish(id);
		return "redirect:/";
	}

	@GetMapping("/{id}/remove")
	public String remove(@PathVariable Long id) {
		dishService.remove(id);
		return "redirect:/";
	}

	@GetMapping("/{id}/eat")
	public String eat(@PathVariable Long id) {
		dishService.markAsEaten(id);
		return "redirect:/";
	}

	@PostMapping("/dish-types/{id}/edit")
	public String edit(@PathVariable Long id,
			@RequestParam String label) {
		dishTypeService.update(id, label);
		return "redirect:/";
	}

	@GetMapping("/dish-types/{id}/delete")
	public String delete(@PathVariable Long id) {
		dishTypeService.delete(id);
		return "redirect:/";
	}

}
