import { body } from "express-validator";

export const propertyValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  
  body('price')
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price must be positive'),
  
  body('city')
    .notEmpty().withMessage('City is required'),
  
  body('property_type')
    .notEmpty().withMessage('Property type is required')
    .isIn(['Apartment', 'House', 'Villa', 'Plot', 'Commercial'])
    .withMessage('Invalid property type'),
  
  body('bedrooms')
    .isInt({ min: 0 }).withMessage('Bedrooms must be a positive integer'),
];

export const updatePropertyValidation = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  
  body('description')
    .optional()
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price must be positive'),
  
  body('city')
    .optional()
    .notEmpty().withMessage('City is required'),
  
  body('property_type')
    .optional()
    .isIn(['Apartment', 'House', 'Villa', 'Plot', 'Commercial'])
    .withMessage('Invalid property type'),
  
  body('bedrooms')
    .optional()
    .isInt({ min: 0 }).withMessage('Bedrooms must be a positive integer'),
];