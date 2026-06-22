'use client';

import Link from 'next/link';
import { FaBed, FaMapMarkerAlt, FaRupeeSign, FaHeart, FaClock, FaBuilding } from 'react-icons/fa';
import { useState } from 'react';

export default function PropertyCard({ property }) {
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
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
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-red-200 h-full flex flex-col max-h-[320px]">
        <div className="relative h-40 bg-gray-200 overflow-hidden flex-shrink-0">
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
                <FaBuilding className="text-3xl mx-auto mb-1 text-gray-300" />
                <span className="text-xs">No Image</span>
              </div>
            </div>
          )}
          
          {property.id % 3 === 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">
              Featured
            </span>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1 rounded-full shadow-md transition"
          >
            <FaHeart className={isLiked ? 'text-red-500 text-sm' : 'text-gray-400 text-sm'} />
          </button>
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <div className="h-7 flex items-center">
            <p className="text-lg font-bold text-red-600 flex items-center gap-1">
              <FaRupeeSign size={14} />
              {formatPrice(property.price)}
            </p>
          </div>


          <div className="h-6">
            <h3 className="font-semibold text-gray-800 truncate text-sm leading-5">
              {property.title}
            </h3>
          </div>

        
          <div className="h-5 flex items-center">
            <p className="text-gray-500 text-xs flex items-center gap-1 truncate">
              <FaMapMarkerAlt className="text-red-400 flex-shrink-0 text-[10px]" />
              <span className="truncate">{property.city}</span>
            </p>
          </div>

     
          <div className="h-8 flex items-center gap-3 mt-1 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1 text-gray-600 text-xs">
              <FaBed className="text-red-400 text-xs" />
              {property.bedrooms} BHK
            </span>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
              {property.property_type}
            </span>
          </div>

          <div className="h-6 flex items-center justify-between mt-1 pt-1.5 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <FaClock className="text-[10px]" />
              {getTimeAgo(property.created_at)}
            </span>
            <span className="text-[10px] text-red-600 hover:text-red-800 font-medium">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}