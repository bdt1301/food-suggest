package com.user.foodsuggest.controller.api;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.user.foodsuggest.dto.CloneDishDTO;
import com.user.foodsuggest.dto.CommunityDishDTO;
import com.user.foodsuggest.model.Dish;
import com.user.foodsuggest.service.CommunityService;
import com.user.foodsuggest.service.DishTypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityRestController {

    private final CommunityService communityService;
    private final DishTypeService dishTypeService;

    @GetMapping
    public ResponseEntity<Page<CommunityDishDTO>> getCommunity(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                communityService.searchPublicDishes(keyword, pageable));
    }

    @GetMapping("/modal")
    public ResponseEntity<Map<String, Object>> getCloneSource(
            @RequestParam Long id) {

        Dish dish = communityService.findPublicDish(id);

        return ResponseEntity.ok(
                Map.of(
                        "dish", dish,
                        "dishTypes", dishTypeService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dish> getPublicDish(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.findPublicDish(id));
    }

    @PostMapping("/clone")
    public ResponseEntity<?> cloneDish(@RequestBody CloneDishDTO dto) {
        try {
            Dish dish = communityService.cloneDish(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(dish);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

}
