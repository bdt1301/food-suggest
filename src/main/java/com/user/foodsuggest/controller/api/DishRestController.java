package com.user.foodsuggest.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.service.DishService;
import com.user.foodsuggest.service.DishTypeService;

@RestController
@RequestMapping("/api/dishes")
public class DishRestController {

    private final DishService dishService;
    private final DishTypeService dishTypeService;

    public DishRestController(DishService dishService, DishTypeService dishTypeService) {
        this.dishService = dishService;
        this.dishTypeService = dishTypeService;
    }

    // GET all dishes
    @GetMapping
    public ResponseEntity<List<Dish>> getAll() {
        List<Dish> dishes = dishService.findAll();
        return ResponseEntity.ok(dishes);
    }

    // Get dish
    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.findById(id));
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Dish dish) {
        Dish createdDish = dishService.create(dish);

        boolean reset = false;
        if (createdDish.isHasEaten()) {
            reset = dishService
                    .resetIfAllEatenByDishType(createdDish.getDishType());
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "dish", createdDish,
                        "resetPerformed", reset));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Dish dish) {

        Dish updatedDish = dishService.update(id, dish);

        boolean reset = dishService
                .resetIfAllEatenByDishType(updatedDish.getDishType());

        return ResponseEntity.ok(Map.of(
                "dish", updatedDish,
                "resetPerformed", reset));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dishService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // MARK ALL UNEATEN
    @PutMapping("/mark-all-uneaten")
    public ResponseEntity<Void> markAllUneaten() {
        dishService.markAllAsUneaten();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/modal")
    public ResponseEntity<Map<String, Object>> getDishModal(
            @RequestParam(required = false) Long id) {

        Dish dish = (id != null)
                ? dishService.findById(id)
                : new Dish();

        return ResponseEntity.ok(
                Map.of(
                        "dish", dish,
                        "dishTypes", dishTypeService.findAll()));
    }

    @PutMapping("/{id}/note")
    public ResponseEntity<Void> updateNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        dishService.updateNote(id, body.get("note"));
        return ResponseEntity.ok().build();
    }

}
