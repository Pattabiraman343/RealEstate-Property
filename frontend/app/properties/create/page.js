// app/properties/create/page.js
'use client';

import { useAuth } from '@/context/AuthContext';
import PropertyForm from '@/components/PropertyForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePropertyPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Property</h1>
      <PropertyForm />
    </div>
  );
}