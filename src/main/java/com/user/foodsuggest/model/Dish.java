package com.user.foodsuggest.model;

import com.user.foodsuggest.enums.Visibility;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dishes")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dishName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_type_id", nullable = false)
    private DishType dishType;

    @Column(columnDefinition = "TEXT")
    private String note;

    private boolean hasEaten = false;
    private boolean active = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility = Visibility.PRIVATE;

}
