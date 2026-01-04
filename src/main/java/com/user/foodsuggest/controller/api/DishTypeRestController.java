package com.user.foodsuggest.controller.api;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.model.DishType;
import com.user.foodsuggest.service.DishTypeService;

@RestController
@RequestMapping("/api/dish-types")
public class DishTypeRestController {

    private final DishTypeService dishTypeService;

    public DishTypeRestController(DishTypeService dishTypeService) {
        this.dishTypeService = dishTypeService;
    }

    @PostMapping
    public DishType create(@RequestParam String label) {
        return dishTypeService.createIfNotExists(label);
    }

    @PutMapping("/{id}")
    public DishType update(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return dishTypeService.update(id, body.get("label"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        dishTypeService.delete(id);
    }

}
