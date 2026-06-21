// controllers/propertyController.js
import * as propertyService from "../services/propertyService.js";
import fs from 'fs';
import path from 'path';

export const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // ✅ Get data from body (FormData fields)
    const { title, description, price, city, property_type, bedrooms } = req.body;
    
    console.log('📝 Creating property with data:', {
      title,
      description,
      price,
      city,
      property_type,
      bedrooms,
      userId
    });
    
    // Handle image
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const property = await propertyService.addProperty({
      title,
      description,
      price,
      city,
      property_type,
      bedrooms,
      image_url: imageUrl
    }, userId);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const properties = await propertyService.fetchProperties();
    
    res.json({
      success: true,
      message: "All properties fetched",
      data: properties
    });
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getById = async (req, res) => {
  try {
    const property = await propertyService.fetchPropertyById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    res.json({
      success: true,
      message: "Property details fetched",
      data: property
    });
  } catch (error) {
    console.error('Get property by id error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const update = async (req, res) => {
  try {
    const property = await propertyService.fetchPropertyById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    if (property.user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own properties"
      });
    }
    
    // ✅ Get data from body (FormData fields)
    const { title, description, price, city, property_type, bedrooms } = req.body;
    
    const updateData = {
      title,
      description,
      price,
      city,
      property_type,
      bedrooms
    };
    
    // Handle image
    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }
    
    console.log('📝 Updating property with data:', updateData);
    
    const updated = await propertyService.editProperty(req.params.id, updateData);
    
    res.json({
      success: true,
      message: "Property updated successfully",
      data: updated
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const remove = async (req, res) => {
  try {
    const property = await propertyService.fetchPropertyById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    if (property.user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own properties"
      });
    }
    
    await propertyService.removeProperty(req.params.id);
    
    res.json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const search = async (req, res) => {
  try {
    const result = await propertyService.searchProperties(req.query);
    
    res.json({
      success: true,
      message: "Search completed",
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const cursorPagination = async (req, res) => {
  try {
    const { cursor, limit } = req.query;
    const result = await propertyService.getPropertiesCursor(cursor, parseInt(limit) || 10);
    
    res.json({
      success: true,
      message: "Cursor pagination success",
      data: result.data,
      nextCursor: result.nextCursor
    });
  } catch (error) {
    console.error('Cursor pagination error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSimilar = async (req, res) => {
  try {
    const properties = await propertyService.fetchSimilarProperties(req.params.id);
    
    res.json({
      success: true,
      message: "Similar properties fetched",
      data: properties
    });
  } catch (error) {
    console.error('Get similar properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyProperties = async (req, res) => {
  try {
    const userId = req.user.userId;
    const properties = await propertyService.fetchMyProperties(userId);
    
    res.json({
      success: true,
      message: "My properties fetched",
      data: properties
    });
  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};