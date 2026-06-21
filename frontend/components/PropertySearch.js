// components/PropertySearch.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function PropertySearch() {
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
  });
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/properties?${params.toString()}`);
  };

  const types = ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'];

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-5 gap-4">
      <input
        type="text"
        placeholder="City"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={filters.property_type}
        onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Type</option>
        {types.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select
        value={filters.bedrooms}
        onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Bedrooms</option>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
      </select>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
        <FaSearch /> Search
      </button>
    </form>
  );
}