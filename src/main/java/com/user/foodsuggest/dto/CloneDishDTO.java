package com.user.foodsuggest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CloneDishDTO {

    private Long sourceDishId;
    private String dishName;
    private Long dishTypeId;

}
