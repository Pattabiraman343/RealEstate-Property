import pool from "../config/db.js";

/**
 * SAVE REFRESH TOKEN
 */
export const saveRefreshToken = async (userId, token) => {
  await pool.query(
    `UPDATE users SET refresh_token = $1 WHERE id = $2`,
    [token, userId]
  );
};

/**
 * REMOVE REFRESH TOKEN
 */
export const removeRefreshToken = async (userId) => {
  await pool.query(
    `UPDATE users SET refresh_token = NULL WHERE id = $1`,
    [userId]
  );
};