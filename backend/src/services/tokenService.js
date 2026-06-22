import pool from "../config/db.js";

export const saveRefreshToken = async (userId, token) => {
  await pool.query(
    `UPDATE users SET refresh_token = $1 WHERE id = $2`,
    [token, userId]
  );
};


export const removeRefreshToken = async (userId) => {
  await pool.query(
    `UPDATE users SET refresh_token = NULL WHERE id = $1`,
    [userId]
  );
};