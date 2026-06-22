import express from "express";
import { create, getByProperty } from "../controllers/inquiryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Create Inquiry (Public)
 *     tags:
 *       - Inquiries
 *     description: Anyone can send an inquiry to a property owner. No authentication required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property_id
 *               - name
 *               - phone
 *               - message
 *             properties:
 *               property_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the property
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Full name of the inquirer
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *                 description: 10-digit phone number
 *               message:
 *                 type: string
 *                 example: "I am interested in this property. Is it still available?"
 *                 description: Inquiry message
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Inquiry sent successfully! Owner will contact you soon."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     property_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     message:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please enter a valid 10-digit phone number"
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
 *     description: Get all inquiries for a specific property. Only the property owner can view.
 *     parameters:
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID of the property
 *     responses:
 *       200:
 *         description: List of inquiries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Inquiries fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       property_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       message:
 *                         type: string
 *                       created_at:
 *                         type: string
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Not the property owner
 *       404:
 *         description: Property not found
 */
router.get("/:property_id", authMiddleware, getByProperty);

export default router;