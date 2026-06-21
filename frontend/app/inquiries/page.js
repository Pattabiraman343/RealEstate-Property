// components/inquiries/InquiryForm.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { inquiryAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function InquiryForm({ propertyId }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to send inquiry');
      return;
    }

    setLoading(true);
    try {
      await inquiryAPI.create({
        property_id: propertyId,
        message,
      });
      toast.success('Inquiry sent successfully!');
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        rows="4"
        placeholder="Write your message to the owner..."
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
      >
        {loading ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  );
}