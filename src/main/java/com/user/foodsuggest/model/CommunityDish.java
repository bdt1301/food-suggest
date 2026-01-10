// package com.user.foodsuggest.model;

// import jakarta.persistence.*;

// @Entity
// @Table(name = "community_dishes")
// public class CommunityDish {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false)
//     private String dishName;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "dish_type_id")
//     private DishType dishType;

//     @Lob
//     @Column(columnDefinition = "TEXT")
//     private String note;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "author_id", nullable = false)
//     private User author;

//     // Getter & Setter
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getDishName() {
//         return dishName;
//     }

//     public void setDishName(String dishName) {
//         this.dishName = dishName;
//     }

//     public DishType getDishType() {
//         return dishType;
//     }

//     public void setDishType(DishType dishType) {
//         this.dishType = dishType;
//     }

//     public String getNote() {
//         return note;
//     }

//     public void setNote(String note) {
//         this.note = note;
//     }

//     public User getAuthor() {
//         return author;
//     }

//     public void setAuthor(User author) {
//         this.author = author;
//     }
// }
