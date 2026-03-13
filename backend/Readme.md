
---

# Backend README

```markdown
# LMS Backend

Backend API for the **Learning Management System (LMS)** built with **Node.js**, **Express**, and **PostgreSQL**.

The backend provides APIs for authentication, student management, notices, and report generation.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Prettier
- Husky
- REST API Architecture

---

## 📦 Prerequisites

Before running the backend, install:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

---

## ⚙️ Installation

Navigate to the backend directory and install dependencies.

```bash
cd backend
npm install
npm start


port 4000
#login auth
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/refresh

#students
GET    /api/v1/students
POST   /api/v1/students
PUT    /api/v1/students/:id
DELETE /api/v1/students/:id

#notices
GET    /api/v1/notices
POST   /api/v1/notices
PUT    /api/v1/notices/:id
DELETE /api/v1/notices/:id

