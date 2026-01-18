package com.user.foodsuggest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDishDTO {

    private Long id;
    private String dishName;
    private String note;
    private String ownerUsername;
    private boolean isOwner;
    private boolean authenticated;

}
