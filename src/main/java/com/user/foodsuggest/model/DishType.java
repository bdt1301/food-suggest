package com.user.foodsuggest.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "dish_types")
public class DishType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String label; // Món canh, Món mặn

	@JsonIgnore
	@OneToMany(mappedBy = "dishType", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Dish> dishes = new ArrayList<>();

	// ===== GETTERS =====
	public Long getId() {
		return id;
	}

	public String getLabel() {
		return label;
	}

	public List<Dish> getDishes() {
		return dishes;
	}

	// ===== SETTERS =====
	public void setId(Long id) {
		this.id = id;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public void setDishes(List<Dish> dishes) {
		this.dishes = dishes;
	}

}
