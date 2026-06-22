import * as propertyModel from "../models/propertyModel.js";

export const addProperty = async (data, userId) => {
  return await propertyModel.createProperty({ ...data, user_id: userId });
};

export const fetchProperties = async () => {
  return await propertyModel.getAllProperties();
};

export const fetchPropertyById = async (id) => {
  return await propertyModel.getPropertyById(id);
};

export const editProperty = async (id, data) => {
  return await propertyModel.updateProperty(id, data);
};

export const removeProperty = async (id) => {
  return await propertyModel.deleteProperty(id);
};

export const searchProperties = async (filters) => {
  return await propertyModel.searchPropertiesModel(filters);
};

export const getPropertiesCursor = async (cursor, limit) => {
  return await propertyModel.cursorPaginationModel(cursor, limit);
};

export const fetchSimilarProperties = async (propertyId) => {
  return await propertyModel.getSimilarPropertiesModel(propertyId);
};

export const fetchMyProperties = async (userId) => {
  return await propertyModel.getMyPropertiesModel(userId);
};