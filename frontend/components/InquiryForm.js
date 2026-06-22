'use client';

import { useState } from 'react';
import { inquiryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaComment, FaPaperPlane } from 'react-icons/fa';

export default function InquiryForm({ propertyId }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, phone, message } = formData;
    
    if (!name || !phone || !message) {
      toast.error('Please fill all fields');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      await inquiryAPI.createPublic({
        property_id: propertyId,
        name: name,
        phone: phone,
        message: message
      });
      
      toast.success('✅ Inquiry sent successfully!');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          <FaUser className="inline mr-1 text-red-400" size={12} />
          Your Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          <FaPhone className="inline mr-1 text-red-400" size={12} />
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter 10-digit number"
          maxLength="10"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
        />
        <p className="text-xs text-gray-400 mt-0.5">We'll share this with the owner</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          <FaComment className="inline mr-1 text-red-400" size={12} />
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Write your message to the owner..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
      >
        {loading ? (
          'Sending...'
        ) : (
          <>
            <FaPaperPlane size={14} />
            Send Inquiry
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-400 text-center mt-2">
        No login required. Your details are safe with us.
      </p>
    </form>
  );
}