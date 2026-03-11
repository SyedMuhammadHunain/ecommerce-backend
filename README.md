<div align="center">

  <img src="./github-header-banner (1).png" alt="Project Banner" width="100%" />

  <br/>
  <br/>

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&pause=1000&color=ffffff&center=true&vCenter=true&width=800&lines=E-Commerce+API+Application;Powered+by+NestJS+%26+MongoDB;Robust,+Scalable,+%26+Secure+API" alt="Typing SVG" />
  </a>

  <br/>

  <p>
    <img src="https://img.shields.io/github/package-json/v/SyedMuhammadHunain/ecommerce-backend?style=for-the-badge&color=E94E32&logo=nestjs" alt="Version">
    <img src="https://img.shields.io/github/last-commit/SyedMuhammadHunain/ecommerce-backend?style=for-the-badge&color=blue&logo=git" alt="Last Commit">
  </p>

</div>

---

<div align="center"> 

## 🛠️ Tech Stack & Tools

</div>

<div align="center">
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/nest_js.png" alt="Nest.js" title="Nest.js"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png" alt="mongoDB" title="mongoDB"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/swagger.png" alt="Swagger" title="Swagger"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png" alt="TypeScript" title="TypeScript"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/postman.png" alt="Postman" title="Postman"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/git.png" alt="Git" title="Git"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/github.png" alt="GitHub" title="GitHub"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/rest.png" alt="REST" title="REST"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/http.png" alt="HTTP" title="HTTP"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/visual_studio_code.png" alt="Visual Studio Code" title="Visual Studio Code"/></code>
</div>

<br/>

## 📖 Introduction

This project is a robust, production-ready backend service for a modern e-commerce platform. Built with the enterprise-grade **NestJS** framework and powered by **MongoDB** via Mongoose, it provides all core functionalities needed for a scalable online store, designed for seamless integration with an Angular frontend.

<br/>

---

## 📺 Project Demo

See the backend in action.
<div align="center">
  <video src="https://github.com/user-attachments/assets/4ab7bb72-4353-44e7-92f5-8ad3521917e7" controls="controls" muted="muted" style="max-width: 100%;">
  </video>
</div>

<br/>

---

## 🌟 Key Features

Click on the sections below to expand and view details about the modules.

<details>
<summary><b>🔐 Authentication & Security (Auth Module)</b></summary>
<br/>

- **JWT & RBAC:** Secure JSON Web Token-based login with Role-Based Access Control (Admin, Customer, Seller).
- **Access & Refresh Tokens:** Dual token strategy with hashed refresh token storage.
- **OTP Email Verification:** 6-digit OTP codes sent via email with auto-expiry and periodic cleanup.
- **Secure Recovery:** Password Reset via cryptographically random email tokens.
- **Guards & Decorators:** Custom `AuthGuard`, `RolesGuard`, `@Public()`, and `@Roles()` decorators.
- **Rate Limiting:** Global throttler protection (10 requests per 60 seconds).
- **Helmet & Compression:** HTTP security headers and response compression enabled.

</details>

<details>
<summary><b>🛍️ E-Commerce Core (Product, Cart & Order Modules)</b></summary>
<br/>

| Module | Functionality |
| :--- | :--- |
| **Products** | Full CRUD APIs with seller ownership. Per-user caching with automatic invalidation. |
| **Shopping Cart** | Persistent cart per user. Add items, update quantities. Cached reads with `.lean()` optimization. |
| **Orders** | Full order lifecycle management with status tracking and validation. |

</details>

<details>
<summary><b>💳 Payments & Integrations (Stripe Module)</b></summary>
<br/>

- **Stripe Integration:** Secure online payment processing using Stripe intents.
- **Email Notifications:** Automated transactional emails (Welcome, Verify, Reset Password) using Nodemailer.

</details>

<details>
<summary><b>🏗️ Architecture & Quality Code</b></summary>
<br/>

- **Modular Structure:** Highly organized NestJS codebase separating concerns (Controllers, Services, Modules).
- **Robust Validation:** Incoming request data validated using DTOs and `class-validator`.
- **Scalable Data Model:** Mongoose schemas designed for flexibility and performance.

</details>

<br/>

---

<div align="center">

## 🚀 Setup Guide

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=22&pause=1000&color=34D399&center=true&vCenter=true&width=600&lines=Initializing+Environment...;Loading+Prerequisites...;follow+the+steps+below+to+launch!+🚀" alt="Setup Animation" />
</a>

<p>Follow the steps to get your local backend instance running.</p>

</div>

<br/>

<details open>
<summary>
  <h3 style="display:inline-block">🔹 Step 1: Engine Check (Prerequisites)</h3>
  <p>Ensure your machine has the necessary core components installed.</p>
</summary>

<div align="center">

| Component | Requirement | Status Check Command |
| :--- | :--- | :--- |
| **Node.js** | `v18.x` or higher | `node -v` |
| **npm** | `v9.x` or higher | `npm -v` |
| **MongoDB** | Running Locally or Atlas URI | `mongod --version` |
| **Git** | Latest Stable | `git --version` |

<br>

<img src="https://img.shields.io/badge/Node.js-Requires_v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS Version" />
<img src="https://img.shields.io/badge/MongoDB-Database_Ready-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Ready" />

</div>
<br>
</details>

<details>
<summary>
  <h3 style="display:inline-block">🔹 Step 2: Acquire Target (Clone & Install)</h3>
  <p>Download the codebase and install necessary dependencies.</p>
</summary>

```bash
# 1. Clone the repository to your local machine
git clone https://github.com/SyedMuhammadHunain/E-Commerce-Backend-Application-NestJS-TypeScript-MongoDB.git

# 2. Navigate into the project directory
cd ecommerce-backend

# 3. Install all project dependencies via npm
npm install
```
</details>

<details> <summary> <h3 style="display:inline-block">🔹 Step 3: Environmental Controls (Config Secrets)</h3> <p>⚠️ Crucial Step: Set up your environment variables for DB and external services.</p> </summary>

**1. Create the file:**
Create a file named `.env` in the root directory of the project.

**2. Fill in the secrets:**

```bash
# ==============================================
# 🔐 APP SECRETS & CONFIGURATION
# ==============================================

# --- Database (Required) ---
# Use mongodb://localhost:27017/your_db_name for local DB
# Or paste your MongoDB Atlas Connection String here.
MONGO_URI=mongodb://localhost:27017/ecommerce_db

# --- Authentication (Required) ---
# Generate a strong, random string for security.
JWT_SECRET=put_a_very_long_random_secure_string_here
JWT_EXPIRATION=1d

# --- Stripe Payments (Required for Checkout) ---
# Get these from your Stripe Developer Dashboard.
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# --- Email Service (Optional for Dev, Required for Auth Emails) ---
# E.g., Using Mailtrap.io for safe local testing.
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password
MAIL_FROM=no-reply@ecommerceapi.com
```
</details>

<details>
<summary><h3 style="display:inline-block">🔹 Step 4: Run Application</h3></summary>

Choose your desired mode to start the NestJS server.

| Mode         | Command                         | Description                                                                 |
|--------------|----------------------------------|-----------------------------------------------------------------------------|
| 🟢 Development | `npm run start:dev`              | Recommended. Watches for file changes and auto-restarts.                   |
| 🟡 Standard    | `npm run start`                  | Runs the app once without watching for changes.                             |
| 🔴 Production  | `npm run build && npm run start:prod` | Builds the project to `/dist` and runs optimized production code.           |

</details>

### 🎮 Try the API (Interactive Swagger Docs)

Don't just read about it—interact with the API directly in your browser.

1. Start the server: `npm run start`
2. Click the button below:

<div align="center">
  <a href="http://localhost:3000/api" target="_blank">
    <img src="https://img.shields.io/badge/OPEN_SWAGGER_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" height="50" alt="Open Swagger API" />
  </a>
</div>

## 📁 Project Structure

<details open>
<summary><strong>src/</strong> — Core application source</summary>

```text
src/
├── 📂 common/              # 🛡️ Guards & Decorators
│   ├── 📂 decorators/      #   @Public(), @Roles()
│   └── 📂 guards/          #   AuthGuard, RolesGuard
├── 📂 config/              # ⚙️ Configuration
│   ├── jwt.config           #   JWT token setup
│   ├── refresh-jwt.config   #   Refresh token setup
│   ├── mailer.config        #   Nodemailer / Gmail
│   └── mongoose.config      #   MongoDB connection pool
├── 📂 controllers/         # 🎮 API Route Handlers
│   ├── auth.controller      #   /auth/* (signup, login, OTP, password reset)
│   ├── cart.controller      #   /cart/* (add-to-cart, get cart)
│   ├── checkout.controller  #   /checkout (create checkout)
│   ├── order.controller     #   /orders/* (list, detail, cancel, status)
│   ├── product.controller   #   /product/* (CRUD)
│   ├── stripe.controller    #   /payment/* (checkout session, webhook)
│   └── user.controller      #   /user/* (become seller)
├── 📂 dtos/                # 📄 Data Transfer Objects (Validation)
├── 📂 enums/               # 🔢 TypeScript Enums
│   ├── roles.enums          #   Customer, Seller, Admin
│   └── order-status.enum    #   Pending, Paid, Shipped, Delivered, Cancelled
├── 📂 interfaces/          # 📐 TypeScript Interfaces
├── 📂 models/              # 🗄️ Mongoose Schemas
│   ├── user.schema          #   User document
│   ├── product.schema       #   Product document
│   ├── cart.schema          #   Cart with items array
│   ├── order.schema         #   Order with status tracking
│   ├── checkout.schema      #   Checkout records
│   └── auth.schema          #   OTP storage
├── � modules/             # 🧩 NestJS Feature Modules
│   ├── auth.module          #   Auth + JWT + Email
│   ├── cart.module           #   Cart management
│   ├── checkout.module       #   Checkout flow
│   ├── order.module          #   Orders + status lifecycle
│   ├── product.module        #   Product catalog
│   ├── stripe.module         #   Stripe payment + webhook
│   └── user.module           #   User management
├── 📂 services/            # 🧠 Business Logic (caching & .lean())
│   ├── auth.service         #   Login, tokens, password reset
│   ├── cart.service          #   Cart CRUD with caching
│   ├── checkout.service      #   Checkout creation
│   ├── email.service         #   OTP & password reset emails
│   ├── order.service         #   Orders with status transitions & caching
│   ├── product.service       #   Product CRUD with caching
│   ├── stripe.service        #   Stripe checkout + webhook handler
│   └── user.service          #   Signup, role management
├── 📜 app.module.ts        # 🏠 Root module
├── 📜 app.controller.ts    # 🏠 Root controller
├── 📜 app.service.ts       # 🏠 Root service
└── 📜 main.ts              # 🚀 Entry Point (Swagger, Helmet, Compression, rawBody)
```
</details>

## 🔌 API Endpoints Reference

<details>
<summary><b>View all available endpoints</b></summary>
<br/>

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/signUp` | ❌ | Public | Register a new user |
| `POST` | `/auth/login` | ❌ | Public | Login with email + OTP |
| `POST` | `/auth/resend-otp` | ❌ | Public | Resend verification OTP |
| `POST` | `/auth/forgot-password` | ❌ | Public | Request password reset link |
| `POST` | `/auth/refresh-token` | ❌ | Public | Get new access token |
| `PATCH` | `/auth/reset-password/:token` | ❌ | Public | Reset password with token |
| `POST` | `/user/become-seller` | ✅ | Any | Upgrade role to Seller |
| `POST` | `/product` | ✅ | Seller | Create a product |
| `GET` | `/product` | ✅ | Seller, Customer | List products |
| `GET` | `/product/:id` | ✅ | Seller, Customer | Get product details |
| `PATCH` | `/product/:id` | ✅ | Seller | Update a product |
| `DELETE` | `/product/:id` | ✅ | Seller | Delete a product |
| `POST` | `/cart/add-to-cart` | ✅ | Any | Add item to cart |
| `GET` | `/cart` | ✅ | Any | Get user's cart |
| `POST` | `/checkout` | ✅ | Customer | Create checkout |
| `GET` | `/orders` | ✅ | Customer, Seller, Admin | List user's orders |
| `GET` | `/orders/:id` | ✅ | Customer, Seller, Admin | Get order details |
| `PATCH` | `/orders/:id/cancel` | ✅ | Customer, Seller | Cancel an order |
| `PATCH` | `/orders/:id/status` | ✅ | Admin | Update order status |
| `POST` | `/payment/create-checkout-session` | ✅ | Customer | Create Stripe session |
| `POST` | `/payment/webhook` | ❌ | Stripe | Receive payment events |

</details>

<br/>

---

<div align="center">

## 🤝 Connect & Support

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="200" alt="Coding Gif" />

<p>If you found this project helpful, please give it a ⭐️ to show your support!</p>

<a href="https://github.com/SyedMuhammadHunain/E-Commerce-Backend-Application-NestJS-TypeScript-MongoDB/stargazers">
  <img src="https://img.shields.io/github/stars/SyedMuhammadHunain/E-Commerce-Backend-Application-NestJS-TypeScript-MongoDB?style=for-the-badge&color=yellow&logo=star&label=Star%20Us" alt="GitHub Stars">
</a>
<a href="https://github.com/SyedMuhammadHunain/E-Commerce-Backend-Application-NestJS-TypeScript-MongoDB/fork">
  <img src="https://img.shields.io/github/forks/SyedMuhammadHunain/E-Commerce-Backend-Application-NestJS-TypeScript-MongoDB?style=for-the-badge&color=orange&logo=git&label=Fork" alt="GitHub Forks">
</a>

<br/>
<br/>

### 👤 Author: Syed Muhammad Hunain

<a href="https://github.com/SyedMuhammadHunain">
  <img src="https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github" alt="GitHub">
</a>
<a href="mailto:hunain.rizwan.ofc@gmail.com">
  <img src="https://img.shields.io/badge/Email-Contact_Me-red?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
</a>
<a href="https://www.linkedin.com/in/syedmuhammadhunain">
  <img src="https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn">
</a>
<a href="https://www.instagram.com/hunain__rizwan/">
  <img src="https://img.shields.io/badge/Instagram-Connect-E4405F?style=for-the-badge&logo=Instagram" alt="Instagram">
</a>

<br/>
<br/>

<p>Copyright © 2025 <a href="https://github.com/SyedMuhammadHunain">Syed Muhammad Hunain</a>.</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=80&section=footer"/>

</div>
