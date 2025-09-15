-- It's good practice to drop existing tables if you need to re-run the script,
-- but be careful as this will delete all data! For initial setup, this is fine.
-- DROP TABLE IF EXISTS ratings;
-- DROP TABLE IF EXISTS stores;
-- DROP TABLE IF EXISTS users;
-- DROP TYPE IF EXISTS user_role;

-- First, create a custom type for user roles. This is more robust than using simple strings.
-- It ensures that the 'role' column can only contain one of these three values.
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'OWNER');

-- Create the users table
-- This table will store information about all users, regardless of their role.
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Automatically creates an incrementing unique integer ID
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- UNIQUE ensures no two users can have the same email
    password VARCHAR(255) NOT NULL, -- This will store the HASHED password, never plain text
    address VARCHAR(400),
    role user_role NOT NULL DEFAULT 'USER', -- Defaults to 'USER' if not specified
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Automatically records when the user was created
);

-- Create the stores table
-- This table will hold all the stores that can be rated.
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    -- This links a store to a user. It's a foreign key.
    -- ON DELETE SET NULL: If a user (owner) is deleted, the store is NOT deleted.
    -- Instead, the owner_id for that store is just set to NULL. This prevents data loss.
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the ratings table
-- This is a 'join table' that links users and stores together.
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    -- CHECK constraint ensures the rating value is always valid (between 1 and 5).
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),

    -- Foreign key linking to the user who made the rating.
    -- ON DELETE CASCADE: If a user is deleted, all of their ratings are automatically deleted too.
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Foreign key linking to the store that was rated.
    -- ON DELETE CASCADE: If a store is deleted, all of its ratings are automatically deleted.
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- Add a constraint to ensure a user can only rate a specific store ONCE.
    -- This prevents a single user from submitting multiple ratings for the same store.
    CONSTRAINT unique_user_store_rating UNIQUE (user_id, store_id)
);