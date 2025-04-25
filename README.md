# E-Commerce Backend Application (NestJS)

This project is a robust backend for an e-commerce platform, built with [NestJS](https://nestjs.com/) and MongoDB using mongoose. It powers all core functionalities needed for a modern online store and is designed to pair with an Angular frontend.

---

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based login, registration, and role-based access (admin, customer and seller)
  - Email verification and password reset flows
- **Product Management**
  - CRUD APIs for products
  - User association for product ownership
- **Shopping Cart**
  - Add, update, and remove items
  - Persistent cart per user
- **Checkout & Order System**
  - Secure checkout process
  - Order creation, tracking, and management
- **Stripe Payment Integration**
  - Secure online payments with Stripe
- **Email Notifications**
  - Automated emails for verification and password reset
- **Modular Structure**
  - Organized codebase using NestJS modules, services, and controllers
- **Validation & Security**
  - DTO validation, guards, middlewares & decorators

---

## 🛠️ Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SyedMuhammadHunain/E-Commerce-Backend-Application-NestJS-TypeScript-MongoDB.git
   cd ecommerce-backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your actual credentials such as:
     - MongoDB connection URI in app.module.ts file
     - JWT secret keys and expiration times
     - Stripe secret & publishable keys
     - Email address & app password

4. **Run the application:**
   ```bash
   # Development
   npm run start

   # Watch mode
   npm run start:dev

   # Production
   npm run start:prod
   ```

---

## 🗂️ Directory Structure (Backend Only)

- `src/`
  - `common/` — Guards, decorators
  - `config/` — Configuration files (jwt-config, mailer-config etc)
  - `controllers/` — API route handlers (REST endpoints)
  - `dtos/` — Data transfer objects (validation schemas)
  - `enums/` — Enum definitions (roles, statuses, etc.)
  - `interfaces/` — TypeScript interfaces for models, requests, etc.
  - `models/` — Mongoose schemas
  - `modules/` — Feature modules (user, auth, product, cart, order, checkout, stripe)
  - `services/` — Business logic for each module/feature

---
