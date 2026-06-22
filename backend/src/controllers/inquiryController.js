import { addInquiry, fetchInquiries } from "../services/inquiryService.js";

export const create = async (req, res) => {
  try {
    const { property_id, name, phone, message } = req.body;

    if (!property_id || !name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number"
      });
    }

    const data = await addInquiry(property_id, name, phone, message);

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully! Owner will contact you soon.",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getByProperty = async (req, res) => {
  try {
    const property_id = req.params.property_id;
    const user_id = req.user.userId;

    const data = await fetchInquiries(property_id, user_id);

    res.json({
      success: true,
      message: "Inquiries fetched",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};