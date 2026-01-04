package com.user.foodsuggest.controller.api;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<DishType> create(@RequestParam String label) {
        DishType newDishType = dishTypeService.createIfNotExists(label);
        return ResponseEntity.status(HttpStatus.CREATED).body(newDishType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishType> update(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            DishType updatedDishType = dishTypeService.update(id, body.get("label"));
            return ResponseEntity.ok(updatedDishType);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dishTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
