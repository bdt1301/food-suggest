package com.user.foodsuggest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.enums.DishType;
import com.user.foodsuggest.service.DishService;

@Controller
@RequestMapping("/")
public class SuggestController {

	private final DishService dishService;

	public SuggestController(DishService dishService) {
		this.dishService = dishService;
	}

	@GetMapping
	public String suggest(Model model) {
		model.addAttribute("dishTypes", DishType.values());
		model.addAttribute("groups", dishService.getSuggestingDishes());
		return "index";
	}

	@GetMapping("/add/{type}")
	public String add(@PathVariable DishType type) {
		dishService.addRandomDish(type);
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

}
