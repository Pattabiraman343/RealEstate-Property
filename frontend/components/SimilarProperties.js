// components/SimilarProperties.js - Complete Version
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import PropertyCard from './PropertyCard';
import Loading from './Loading';

export default function SimilarProperties({ propertyId }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await propertyAPI.getSimilar(propertyId);
        setProperties(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch similar:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [propertyId]);

  if (loading) return <Loading />;
  if (properties.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Similar Properties
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({properties.length} found)
          </span>
        </h2>
        <Link 
          href="/properties" 
          className="text-red-500 hover:text-red-600 text-sm font-medium transition flex items-center gap-1"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}