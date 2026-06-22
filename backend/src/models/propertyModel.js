import pool from "../config/db.js";

export const createIndexes = async () => {
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
    CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
    CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
    CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
  `);
};

export const createProperty = async (data) => {
  const { title, description, price, city, property_type, bedrooms, image_url, user_id } = data;
  const result = await pool.query(
    `INSERT INTO properties 
     (title, description, price, city, property_type, bedrooms, image_url, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, description, price, city, property_type, bedrooms, image_url, user_id]
  );
  return result.rows[0];
};

export const getAllProperties = async () => {
  const result = await pool.query(
    "SELECT * FROM properties ORDER BY created_at DESC"
  );
  return result.rows;
};

export const getPropertyById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, u.name as owner_name, u.email as owner_email
     FROM properties p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateProperty = async (id, data) => {
  const { title, description, price, city, property_type, bedrooms, image_url } = data;
  const result = await pool.query(
    `UPDATE properties 
     SET title=$1, description=$2, price=$3, city=$4, property_type=$5, bedrooms=$6, image_url=$7
     WHERE id=$8 RETURNING *`,
    [title, description, price, city, property_type, bedrooms, image_url, id]
  );
  return result.rows[0];
};

export const deleteProperty = async (id) => {
  const result = await pool.query(
    "DELETE FROM properties WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const searchPropertiesModel = async (filters) => {
  let whereClause = [];
  const values = [];
  let paramCount = 1;

  if (filters.city) {
    whereClause.push(`city ILIKE $${paramCount}`);
    values.push(`%${filters.city}%`);
    paramCount++;
  }

  if (filters.property_type) {
    whereClause.push(`property_type = $${paramCount}`);
    values.push(filters.property_type);
    paramCount++;
  }

  if (filters.bedrooms) {
    whereClause.push(`bedrooms = $${paramCount}`);
    values.push(Number(filters.bedrooms));
    paramCount++;
  }

  if (filters.minPrice) {
    whereClause.push(`price >= $${paramCount}`);
    values.push(Number(filters.minPrice));
    paramCount++;
  }

  if (filters.maxPrice) {
    whereClause.push(`price <= $${paramCount}`);
    values.push(Number(filters.maxPrice));
    paramCount++;
  }

  const where = whereClause.length ? `WHERE ${whereClause.join(' AND ')}` : '';
  
  let orderBy = "ORDER BY created_at DESC";
  if (filters.sort === "price_asc") orderBy = "ORDER BY price ASC";
  if (filters.sort === "price_desc") orderBy = "ORDER BY price DESC";

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) FROM properties ${where}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count);

 
  const dataQuery = `
    SELECT id, title, description, price, city, property_type, bedrooms, image_url, created_at
    FROM properties
    ${where}
    ${orderBy}
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;
  
  const dataValues = [...values, limit, offset];
  const dataResult = await pool.query(dataQuery, dataValues);

  return {
    data: dataResult.rows.map(p => ({ ...p, price: Number(p.price) })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const cursorPaginationModel = async (cursor, limit = 10) => {
  let query = `
    SELECT id, title, price, city, property_type, bedrooms, image_url, created_at
    FROM properties
  `;
  const values = [];
  
  if (cursor) {
    query += ` WHERE id < $1`;
    values.push(cursor);
    query += ` ORDER BY id DESC LIMIT $2`;
    values.push(limit);
  } else {
    query += ` ORDER BY id DESC LIMIT $1`;
    values.push(limit);
  }

  const result = await pool.query(query, values);
  
  return {
    data: result.rows,
    nextCursor: result.rows.length ? result.rows[result.rows.length - 1].id : null
  };
};

export const getSimilarPropertiesModel = async (propertyId) => {
  const property = await getPropertyById(propertyId);
  if (!property) return [];

  const minPrice = property.price * 0.7;
  const maxPrice = property.price * 1.3;

  const result = await pool.query(
    `SELECT id, title, price, city, property_type, bedrooms, image_url
     FROM properties
     WHERE id != $1
       AND (city ILIKE $2 OR property_type = $3)
       AND price BETWEEN $4 AND $5
     ORDER BY ABS(price - $6)
     LIMIT 6`,
    [
      propertyId,
      `%${property.city}%`,
      property.property_type,
      minPrice,
      maxPrice,
      property.price
    ]
  );

  return result.rows.map(p => ({ ...p, price: Number(p.price) }));
};

export const getMyPropertiesModel = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM properties WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(p => ({ ...p, price: Number(p.price) }));
};