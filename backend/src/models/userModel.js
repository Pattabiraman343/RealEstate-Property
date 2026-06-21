import pool from "../config/db.js";

/**
 * Find user by email
 * @param {string} email
 */
export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password, created_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

/**
 * Find user by id
 * (used in auth middleware / profile APIs)
 */
export const findUserById = async (id) => {
  const query = `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Create new user
 */
export const createUser = async ({ name, email, password }) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;

  const result = await pool.query(query, [
    name,
    email,
    password,
  ]);

  return result.rows[0];
};