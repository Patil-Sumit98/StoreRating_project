// This file manages the connection to the PostgreSQL database.

// Import the 'Pool' class from the 'pg' library.
// 'Pool' is used to manage multiple client connections efficiently.
const { Pool } = require('pg');

// Load environment variables from the .env file into process.env
require('dotenv').config();

// Create a new Pool instance. The Pool will use the environment variables
// (PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT) by default, but we specify
// them here for clarity and to match our .env file convention.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// We'll export an object with a 'query' method. This is a good practice
// that centralizes our database interactions. Any part of our app that
// needs to query the database can just import this module.
module.exports = {
  query: (text, params) => pool.query(text, params),
};