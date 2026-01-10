// package com.user.foodsuggest.model;

// import jakarta.persistence.*;
// import java.util.ArrayList;
// import java.util.List;

// @Entity
// @Table(name = "users")
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false, unique = true)
//     private String username;

//     @Column(nullable = false)
//     private String password;

//     @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<Dish> dishes = new ArrayList<>();

//     @OneToMany(mappedBy = "author")
//     private List<CommunityDish> communityDishes = new ArrayList<>();

//     // Getter & Setter
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getUsername() {
//         return username;
//     }

//     public void setUsername(String username) {
//         this.username = username;
//     }

//     public String getPassword() {
//         return password;
//     }

//     public void setPassword(String password) {
//         this.password = password;
//     }

//     public List<Dish> getDishes() {
//         return dishes;
//     }

//     public void setDishes(List<Dish> dishes) {
//         this.dishes = dishes;
//     }

//     public List<CommunityDish> getCommunityDishes() {
//         return communityDishes;
//     }

//     public void setCommunityDishes(List<CommunityDish> communityDishes) {
//         this.communityDishes = communityDishes;
//     }
// }
