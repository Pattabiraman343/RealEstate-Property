// models/inquiryModel.js
import pool from "../config/db.js";

// CREATE INQUIRY - PUBLIC (No authentication required)
export const createInquiry = async (data) => {
  const { property_id, name, phone, message } = data;

  const result = await pool.query(
    `INSERT INTO inquiries (property_id, name, phone, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [property_id, name, phone, message]
  );

  return result.rows[0];
};

// GET INQUIRIES FOR PROPERTY (OWNER VALIDATION)
export const getInquiriesByProperty = async (property_id, user_id) => {
  const result = await pool.query(
    `
    SELECT i.*, 
           p.user_id as owner_id,
           u.name as owner_name
    FROM inquiries i
    JOIN properties p ON p.id = i.property_id
    JOIN users u ON u.id = p.user_id
    WHERE i.property_id = $1
    AND p.user_id = $2
    ORDER BY i.created_at DESC
    `,
    [property_id, user_id]
  );

  return result.rows;
};

// DUPLICATE CHECK - By phone number
export const checkDuplicateInquiryModel = async (property_id, phone) => {
  const result = await pool.query(
    `
    SELECT * FROM inquiries
    WHERE property_id = $1 AND phone = $2
    `,
    [property_id, phone]
  );

  return result.rows[0];
};