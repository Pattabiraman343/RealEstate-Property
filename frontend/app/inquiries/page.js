// app/inquiries/page.js
'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { inquiryAPI } from '@/lib/api';

export default function InquiriesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchInquiries();
  }, [isAuthenticated]);

  const fetchInquiries = async () => {
    try {
      // Fetch inquiries for user's properties
      const res = await inquiryAPI.getMyInquiries();
      setInquiries(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Inquiries</h1>
      
      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">No inquiries yet.</p>
          <Link href="/properties" className="text-red-600 hover:underline">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-lg shadow-md p-6">
              <p className="font-semibold">{inquiry.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">{inquiry.phone}</p>
              <p className="mt-2">{inquiry.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(inquiry.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}