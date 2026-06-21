// components/PropertyCard.js
'use client';

import Link from 'next/link';
import { FaBed, FaMapMarkerAlt, FaRupeeSign, FaHeart, FaShare, FaClock, FaBuilding } from 'react-icons/fa';
import { useState } from 'react';

export default function PropertyCard({ property }) {
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // ✅ FIX: Use Render URL instead of 
  const imageUrl = property.image_url 
    ? `https://realestate-property-jq22.onrender.com${property.image_url}` 
    : null;

  const formatPrice = (price) => {
    if (!price) return '0';
    const num = Number(price);
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
    return num.toLocaleString();
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col border border-gray-200 hover:border-red-200">
        <div className="relative h-52 bg-gray-200 overflow-hidden">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              <div className="text-center">
                <FaBuilding className="text-4xl mx-auto mb-1 text-gray-300" />
                <span className="text-xs">No Image</span>
              </div>
            </div>
          )}
          
          {property.id % 3 === 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
              Featured
            </span>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition"
          >
            <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xl font-bold text-red-600 flex items-center gap-1">
            <FaRupeeSign size={16} />
            {formatPrice(property.price)}
          </p>
          <h3 className="font-semibold text-gray-800 truncate mt-0.5 text-base">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
            <FaMapMarkerAlt className="text-red-400 flex-shrink-0 text-xs" />
            <span className="truncate">{property.city}</span>
          </p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-gray-600 text-sm">
              <FaBed className="text-red-400" />
              {property.bedrooms} BHK
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              {property.property_type}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FaClock className="text-xs" />
              {getTimeAgo(property.created_at)}
            </span>
            <span className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}