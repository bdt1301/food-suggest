package com.user.foodsuggest.controller;

import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.service.DishTypeService;

@RestController
@RequestMapping("/dish-types")
public class DishTypeController {

    private final DishTypeService dishTypeService;

    public DishTypeController(DishTypeService dishTypeService) {
        this.dishTypeService = dishTypeService;
    }

    @PostMapping
    public DishType create(@RequestParam String label) {
        return dishTypeService.createIfNotExists(label);
    }

}
