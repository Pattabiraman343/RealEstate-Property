import {
  registerUser,
  loginUser,
} from "../services/authService.js";

import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const data = await registerUser(req.body);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: data.user,
        accessToken: data.accessToken,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        user: data.user,
        accessToken: data.accessToken,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/**
 * REFRESH TOKEN (SAFE VERSION)
 */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const result = await pool.query(
      "SELECT refresh_token FROM users WHERE id = $1",
      [decoded.userId]
    );

    const storedToken = result.rows[0]?.refresh_token;

    // ❌ invalid token check
    if (!storedToken || storedToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 🔥 NEW ACCESS TOKEN
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🔥 ROTATE REFRESH TOKEN (IMPORTANT FIX)
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await pool.query(
      "UPDATE users SET refresh_token = $1 WHERE id = $2",
      [newRefreshToken, decoded.userId]
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Token expired or invalid",
    });
  }
};

/**
 * LOGOUT (ADDED - IMPORTANT)
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

      // remove refresh token from DB
      await pool.query(
        "UPDATE users SET refresh_token = NULL WHERE id = $1",
        [decoded.userId]
      );
    }

    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};