package com.user.foodsuggest.dto;

import com.user.foodsuggest.enums.Visibility;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DishFilterDTO {

    private String keyword;
    private Long dishTypeId;
    private Boolean hasEaten;
    private Visibility visibility;

}
