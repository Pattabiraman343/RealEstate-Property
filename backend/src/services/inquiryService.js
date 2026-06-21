// services/inquiryService.js
import {
  createInquiry,
  getInquiriesByProperty,
  checkDuplicateInquiryModel,
} from "../models/inquiryModel.js";

// CREATE INQUIRY - PUBLIC (No authentication required)
export const addInquiry = async (property_id, name, phone, message) => {
  // Check duplicate by phone number
  const exists = await checkDuplicateInquiryModel(property_id, phone);
  if (exists) {
    throw new Error("You already sent an inquiry for this property");
  }

  return await createInquiry({
    property_id,
    name,
    phone,
    message,
  });
};

// GET INQUIRIES (WITH OWNERSHIP CHECK)
export const fetchInquiries = async (property_id, user_id) => {
  return await getInquiriesByProperty(property_id, user_id);
};

// DUPLICATE CHECK
export const checkDuplicateInquiry = async (property_id, phone) => {
  return await checkDuplicateInquiryModel(property_id, phone);
};