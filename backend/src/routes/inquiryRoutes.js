import express from "express";
import { create, getByProperty } from "../controllers/inquiryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Create Inquiry
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/", create);

/**
 * @swagger
 * /api/inquiries/{property_id}:
 *   get:
 *     summary: Get Inquiries For Property
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of inquiries
 *       404:
 *         description: Property not found
 */
router.get("/:property_id", authMiddleware, getByProperty);

export default router;