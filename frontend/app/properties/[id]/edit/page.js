// app/properties/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { propertyAPI } from '@/lib/api';
import PropertyForm from '@/components/PropertyForm';
import Loading from '@/components/Loading';

export default function EditPropertyPage({ params }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertyAPI.getById(params.id);
        setProperty(res.data.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [params.id]);

  if (loading) return <Loading />;
  if (!property) return <div className="text-center py-12">Property not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
      <PropertyForm property={property} isEdit={true} />
    </div>
  );
}