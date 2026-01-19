# 🍽️ Food Suggestion Website

## 🌐 Live Demo
👉 https://foodsuggest.onrender.com  

---

## ▶️ Project Requirements

This project was developed and tested using the following **personal development environment**:

### 🔧 Development Environment
- Java Development Kit (JDK) **17.0.12**
- Apache Maven **3.9.9**
- Build & run the application using **Docker**

### 🗄️ Database
- **PostgreSQL**
- Database connection configured in `application.properties`
- Environment variables used for production (Render)

---

## 🛠️ Technologies Used

| Layer | Technologies |
|------|-------------|
| Backend | Spring Boot (RESTful API & MVC, JPA/Hibernate, Security) |
| Frontend | HTML, CSS, JavaScript |
| UI Framework | Bootstrap |
| Template Engine | Thymeleaf |
| Rich Text Editor | Quill.js |
| Database | PostgreSQL |

---

## 🧱 Backend Design

### 📦 Main Entities
- `User`
- `Dish`
- `DishType`

### 🔗 Entity Relationships

| Relationship | Description |
|-------------|------------|
| User – Dish | One-to-Many (public dishes are used for community features) |
| User – DishType | One-to-Many (personal dish categories) |
| Dish – DishType | Many-to-One |

**Example:** A dish becomes visible in Community when its visibility is set to **PUBLIC**.

---

## 🔐 Authentication & Authorization

### 🔑 Authentication
- Login & registration handled via **Spring Security Filter Chain**
- Passwords securely stored using **BCryptPasswordEncoder**
- Prevents login with invalid accounts
- Supports **Remember Me** functionality

### 🛡️ Authorization (RBAC)

Role-Based Access Control (**RBAC**) is implemented using **Spring Security**.

| Role | Permissions |
|------|-------------|
| **Anonymous** | View community dishes |
| **User** | All Anonymous permissions<br>CRUD personal dishes & dish types<br>Set dish visibility (PUBLIC / PRIVATE)<br>View & clone dishes from Community |

---

## 🎨 Frontend Features

- ➕ Create / Update / Delete dishes
- 👁️ Set dish visibility (**PUBLIC / PRIVATE**)
- 🌍 Community dishes page (public dishes)
- 📋 Clone dishes from Community to personal list
- 📝 Rich text editor for dish notes (powered by **Quill.js**)
- 🔍 Search & filter dishes
- 🔐 Role-based UI rendering (Anonymous / User)
- 💬 Confirmation modals for critical actions
- 📱 Responsive & mobile-friendly UI
