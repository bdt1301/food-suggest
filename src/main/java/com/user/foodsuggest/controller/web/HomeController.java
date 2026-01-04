package com.user.foodsuggest.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.user.foodsuggest.service.DishService;
import com.user.foodsuggest.service.DishTypeService;

@Controller
public class HomeController {
    private final DishService dishService;
    private final DishTypeService dishTypeService;

    public HomeController(DishService dishService, DishTypeService dishTypeService) {
        this.dishService = dishService;
        this.dishTypeService = dishTypeService;
    }

    @GetMapping("/")
    public String showPage(Model model) {
        model.addAttribute("dishTypes", dishTypeService.findAll());
        model.addAttribute("groups", dishService.getSuggestingDishes());

        return "index";
    }
}
