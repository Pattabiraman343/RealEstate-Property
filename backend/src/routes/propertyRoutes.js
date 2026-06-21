import express from "express";
import { create, getAll, getById,update,remove,search,cursorPagination,getSimilar,getMyProperties} from "../controllers/propertyController.js";
import { authMiddleware} from "../middleware/authMiddleware.js";
import {
    propertyValidation,
    updatePropertyValidation,
  } from "../validators/propertyValidator.js";import { validate } from "../middleware/validate.js";

  import { uploadSingle } from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create Property
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               city:
 *                 type: string
 *               property_type:
 *                 type: string
 *               bedrooms:
 *                 type: integer
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  uploadSingle('image'),
  propertyValidation,
  validate,
  create
);

router.get("/my", authMiddleware, getMyProperties);
  /**
 * @swagger
 * /api/properties/search:
 *   get:
 *     summary: Search Properties
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: property_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: price_asc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Filtered properties
 */
router.get("/search", search);

/**
 * @swagger
 * /api/properties/cursor:
 *   get:
 *     summary: Cursor Pagination
 *     tags:
 *       - Properties
 *     responses:
 *       200:
 *         description: Cursor paginated properties
 */
router.get("/cursor", cursorPagination);
/**
 * @swagger
 * /api/properties/{id}/similar:
 *   get:
 *     summary: Get Similar Properties
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Similar properties
 */
router.get("/:id/similar", getSimilar);
/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get All Properties
 *     tags:
 *       - Properties
 *     responses:
 *       200:
 *         description: List of all properties
 */
router.get("/", getAll);
/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get Property By ID
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get("/:id", getById);// UPDATE

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update Property
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               city:
 *                 type: string
 *               property_type:
 *                 type: string
 *               bedrooms:
 *                 type: integer
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
router.put(
  "/:id",
  authMiddleware,
  uploadSingle('image'),
  updatePropertyValidation,
  validate,
  update
);
  // DELETE
/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete Property
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
router.delete("/:id", authMiddleware, remove);
export default router;