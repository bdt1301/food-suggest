package com.user.foodsuggest.model;

import com.user.foodsuggest.enums.DishType;

import jakarta.persistence.*;

@Entity
@Table(name = "dishes")
public class Dish {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String dishName;

	@Enumerated(EnumType.STRING)
	private DishType dishType;

	private boolean hasEaten;
	private boolean active = false;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDishName() {
		return dishName;
	}

	public void setDishName(String dishName) {
		this.dishName = dishName;
	}

	public DishType getDishType() {
		return dishType;
	}

	public void setDishType(DishType dishType) {
		this.dishType = dishType;
	}

	public boolean isHasEaten() {
		return hasEaten;
	}

	public void setHasEaten(boolean hasEaten) {
		this.hasEaten = hasEaten;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}
