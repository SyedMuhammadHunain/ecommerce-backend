<div align="center">

  <img src="./github-header-banner (1).png" alt="Project Banner" width="100%" />

  <br/>
  <br/>

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&pause=1000&color=E94E32&center=true&vCenter=true&width=800&lines=E-Commerce+API+Application;Powered+by+NestJS+%26+MongoDB;Robust,+Scalable,+%26+Secure+API" alt="Typing SVG" />
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

### 🎮 Try the API (Interactive Swagger Docs)

Don't just read about it—interact with the API directly in your browser.

<div align="center">
  <a href="http://localhost:3000/api" target="_blank">
    <img src="https://img.shields.io/badge/OPEN_SWAGGER_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" height="50" alt="Open Swagger API" />
  </a>
</div>

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
- **Verification Flows:** Automated email verification upon registration.
- **Secure Recovery:** Safe Password Reset functionality via email tokens.
- **Guards & Decorators:** Custom NestJS guards for protecting routes.

</details>

<details>
<summary><b>🛍️ E-Commerce Core (Product, Cart & Order Modules)</b></summary>
<br/>

| Module | Functionality |
| :--- | :--- |
| **Products** | Full CRUD APIs. User association for seller product ownership. |
| **Shopping Cart** | Persistent cart per user. Add, update quantities, and remove items seamlessly. |
| **Orders** | Secure checkout process, order creation, status tracking, and history management. |

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

<p>Follow these five steps to get your local backend instance running.</p>

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

<details>
<summary><h3 style="display:inline-block">🔐 Setup Secrets (Environment Variables)</h3></summary>

<p>⚠️ <strong>Crucial Step: Set up your environment variables before running the app.</strong></p>

**1. Create the file:**
Create a file named `.env` in the root directory of the project (next to `package.json`).

**2. Add the variables:**
Copy the contents of `.env.example` (if it exists) into your new `.env` file, or copy the structure below and fill in your real values:

```bash
# .env file content example

PORT=3000
DATABASE_URL="mongodb://localhost:27017/your-db-name"
JWT_SECRET="your_super_secret_key"
API_KEY="your_api_key_here"
```


