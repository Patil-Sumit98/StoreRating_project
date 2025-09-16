Store Rating System: A Full-Stack PERN Application
Project Overview
The Store Rating System is a comprehensive, full-stack web application developed utilizing the PERN (PostgreSQL, Express.js, React, Node.js) architecture. The platform is designed to facilitate the rating and reviewing of commercial establishments, incorporating a sophisticated role-based access control (RBAC) system. This system provides distinct functionalities and permissions for three user archetypes: general users, registered store owners, and system administrators, thereby creating a secure and structured multi-user environment.

Technology Stack
The application's architecture is founded upon a modern and robust selection of technologies designed for scalability and maintainability.

Category

Technology

Implementation Details

Backend Framework

Node.js, Express.js

Constructs the RESTful API, managing all business logic and server-side operations.

Database System

PostgreSQL

Serves as the relational database for persistent storage of all application data.

Frontend Library

React.js

Drives the client-side user interface, enabling a dynamic and responsive single-page application (SPA) experience.

Authentication

JWT, bcrypt.js

Implements secure user authentication, session management via JSON Web Tokens, and password hashing.

Client-Side Routing

React Router

Manages navigation and view rendering within the client-side application.

HTTP Client

Axios

Facilitates asynchronous communication between the frontend client and the backend API.

Local Development Environment Setup
To deploy the application on a local machine for development or testing purposes, the following steps must be executed in sequence.

Prerequisites
Node.js (version 18.x or later is recommended)

An active installation of PostgreSQL

1. Repository Cloning and Initial Installation
Begin by cloning the source code repository to your local machine and navigating into the newly created project directory.

git clone [Your-Repo-URL]
cd [Your-Repo-Folder]

2. Backend Configuration
The backend server requires the installation of its dependencies and configuration of the database connection.

cd backend
npm install

3. Database Initialization
A PostgreSQL database must be created and configured. A .env file must be created within the /backend directory to store the database credentials and application secrets, formatted as follows:

DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=store_rater
JWT_SECRET=thisisareallylongandsecretstringforjwt123!

4. Schema Migration
The database tables are defined in the database.sql script. Execute this script to migrate the schema to the store_rater database.

psql -U your_postgres_username -d store_rater -f database.sql

5. Backend Server Execution
Launch the backend server, which will operate on http://localhost:5000.

npm run dev

6. Frontend Configuration
In a separate terminal, navigate to the frontend application's directory and install its dependencies.

cd frontend/store-rater-frontend
npm install
npm start

7. Application Access
Upon successful compilation, the frontend application will be accessible via a web browser at http://localhost:3000. New users can be registered through the user interface to begin interacting with the system.

Core Functionality and Features
The application's feature set is segmented based on user roles to ensure appropriate data access and permissions.

Regular User Capabilities
Secure registration and authentication utilizing JSON Web Tokens.

Ability to browse and sort the complete catalog of stores by various criteria, including name, creation date, or average rating.

Access to detailed, read-only pages for individual stores.

Functionality to submit and subsequently update personal 1-5 star ratings.

A private settings page for secure password management.

Store Owner Capabilities
Access to a private dashboard dedicated to their assigned commercial establishment.

Real-time tracking of the store's aggregate average rating.

A detailed manifest of all users who have submitted a rating for their store.

Inheritance of all permissions granted to Regular Users.

Administrator Capabilities
Access to a comprehensive administrative dashboard presenting platform-wide analytics, including total user, store, and rating counts.

Full management of the user roster, including the ability to view, sort, and modify user roles (e.g., promoting a USER to an OWNER).

Authority to add new stores to the system and assign ownership to a registered user during the creation process.

Database Schema
The application's data architecture is structured around three primary relational tables:

users: This table contains all user account information, critically including the role (USER, OWNER, ADMIN) that governs their permissions.

stores: This table houses all information pertinent to the commercial establishments, including an optional owner_id foreign key that links to the users table.

ratings: This join table establishes a many-to-many relationship between users and stores, storing the rating value and enforcing a unique constraint to ensure a user may only rate a given store once.

API Endpoint Specification
# Authentication
POST /api/auth/register     - Facilitates the registration of a new user.
POST /api/auth/login        - Authenticates an existing user and returns a JWT.
PUT  /api/auth/updatepassword - Allows an authenticated user to update their password.

# Stores & Ratings
GET    /api/stores          - Retrieves a comprehensive list of all stores, with support for sorting.
GET    /api/stores/:id      - Retrieves detailed information for a single store.
POST   /api/stores          - [Admin] Enables the creation of a new store.
POST   /api/stores/:id/ratings - [User] Allows submission of a new rating.
PUT    /api/stores/:id/ratings - [User] Allows an existing rating to be updated.

# Role-Specific Endpoints
GET /api/admin/stats        - [Admin] Retrieves application-wide statistics.
GET /api/admin/users        - [Admin] Retrieves a list of all users.
PUT /api/admin/users/:id    - [Admin] Modifies a specific user's role.
GET /api/owner/dashboard    - [Owner] Retrieves dashboard data for the authenticated owner's store.
