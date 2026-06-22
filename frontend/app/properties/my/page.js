'use client';

import { useState, useEffect } from 'react';
import { propertyAPI } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    try {
      const res = await propertyAPI.getMy();
      setProperties(res.data.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Link href="/properties/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">You haven't listed any properties yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}