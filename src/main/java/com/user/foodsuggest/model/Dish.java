package com.user.foodsuggest.model;

import jakarta.persistence.*;

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

	private boolean hasEaten;
	private boolean active = false;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;

	// Getter & Setter
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

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
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

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}
	
}
