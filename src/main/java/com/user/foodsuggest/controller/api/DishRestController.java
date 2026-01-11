package com.user.foodsuggest.controller.api;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    // Get all dishes
    @GetMapping
    public ResponseEntity<Page<Dish>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "dishName") String sort,
            @RequestParam(defaultValue = "asc") String direction) {
                
        Sort sortObj = direction.equalsIgnoreCase("desc")
                ? Sort.by(sort).descending()
                : Sort.by(sort).ascending();

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return ResponseEntity.ok(
                dishService.search(keyword, pageable));
    }

    // Get dish
    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.findOwnedDish(id));
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
                ? dishService.findOwnedDish(id)
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
