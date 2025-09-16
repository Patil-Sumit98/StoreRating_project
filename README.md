# 🏪 Store Rating System – A Full-Stack PERN Application

## 📌 Project Overview

The **Store Rating System** is a full-stack web application built using the **PERN stack** (PostgreSQL, Express.js, React, Node.js). It enables users to rate and review commercial establishments while enforcing secure, role-based access control (RBAC). The system supports three user roles:

- **Regular Users**: Can browse and rate stores.
- **Store Owners**: Manage their store’s ratings and view user feedback.
- **Administrators**: Oversee platform-wide analytics and user/store management.

---

## 🧰 Technology Stack

| Category              | Technology         | Description                                                                 |
|----------------------|--------------------|-----------------------------------------------------------------------------|
| Backend Framework     | Node.js, Express.js | RESTful API handling business logic and server-side operations              |
| Database System       | PostgreSQL         | Relational database for persistent storage                                  |
| Frontend Library      | React.js           | Dynamic and responsive single-page application (SPA)                        |
| Authentication        | JWT, bcrypt.js     | Secure login, token-based sessions, and password hashing                    |
| Client-Side Routing   | React Router       | Navigation and view rendering on the frontend                               |
| HTTP Client           | Axios              | Asynchronous communication between frontend and backend                     |

---

## 🛠️ Local Development Setup

### 🔧 Prerequisites

- Node.js (v18.x or later)
- PostgreSQL (active installation)

### 📦 Installation Steps

1. **Clone Repository**
   ```bash
   git clone [Your-Repo-URL]
   cd [Your-Repo-Folder]
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in `/backend` with the following:
   ```env
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=store_rater
   JWT_SECRET=thisisareallylongandsecretstringforjwt123!
   ```

4. **Database Migration**
   Run the schema migration:
   ```bash
   psql -U your_postgres_username -d store_rater -f database.sql
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   # Runs on http://localhost:5000
   ```

6. **Frontend Setup**
   ```bash
   cd frontend/store-rater-frontend
   npm install
   npm start
   # Runs on http://localhost:3000
   ```

---

## 🚀 Core Features

### 👤 Regular Users

- JWT-based registration and login
- Browse and sort stores by name, date, or rating
- View detailed store pages
- Submit and update 1–5 star ratings
- Manage password via private settings page

### 🏪 Store Owners

- Access to a private dashboard
- View average store rating in real-time
- See list of users who rated their store
- Inherit all Regular User permissions

### 🛡️ Administrators

- Platform-wide analytics dashboard
- Manage users and modify roles
- Add new stores and assign ownership

---

## 🗃️ Database Schema

- **users**: Stores user credentials and roles (`USER`, `OWNER`, `ADMIN`)
- **stores**: Contains store details and optional `owner_id` foreign key
- **ratings**: Join table linking users and stores with a unique rating per user-store pair

---

## 📡 API Endpoints

### 🔐 Authentication

```http
POST /api/auth/register         # Register a new user
POST /api/auth/login            # Login and receive JWT
PUT  /api/auth/updatepassword   # Update password
```

### 🏬 Stores & Ratings

```http
GET    /api/stores                  # List all stores (sortable)
GET    /api/stores/:id              # Get store details
POST   /api/stores                  # [Admin] Create a new store
POST   /api/stores/:id/ratings      # [User] Submit a rating
PUT    /api/stores/:id/ratings      # [User] Update a rating
```

### 🎯 Role-Specific

```http
GET /api/admin/stats            # [Admin] Get platform statistics
GET /api/admin/users            # [Admin] List all users
PUT /api/admin/users/:id        # [Admin] Modify user role
GET /api/owner/dashboard        # [Owner] Get store dashboard
```

---

## 📎 License

This project is open-source and available under the [MIT License](LICENSE).
