// app/properties/[id]/client.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import SimilarProperties from '@/components/SimilarProperties';
import InquiryForm from '@/components/InquiryForm';
import { 
  FaBed, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaUser, 
  FaHeart, 
  FaShare, 
  FaBath, 
  FaRulerCombined,
  FaCheckCircle,
  FaHome,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaArrowLeft
} from 'react-icons/fa';

export default function PropertyDetailClient({ property }) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const formatPrice = (price) => {
    if (!price) return '0';
    const num = Number(price);
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
    return num.toLocaleString('en-IN');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await propertyAPI.delete(property.id);
      toast.success('Property deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const imageUrl = property.image_url 
  ? `https://realestate-property-jq22.onrender.com${property.image_url}` 
  : null;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">Back to Properties</span>
        </button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="relative h-96 bg-gray-200">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <div className="text-center">
                      <FaBuilding className="text-5xl mx-auto mb-2 text-gray-300" />
                      <span>No Image Available</span>
                    </div>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.id % 3 === 0 && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Verified
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
                    aria-label="Save property"
                  >
                    <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
                    aria-label="Share property"
                  >
                    <FaShare className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Quick Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-3xl font-bold text-red-600 flex items-center gap-1">
                <FaRupeeSign size={24} />
                {formatPrice(property.price)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-3">Property Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <FaBed className="text-red-400" />
                  <span>{property.bedrooms} BHK</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaBuilding className="text-red-400" />
                  <span>{property.property_type}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-red-400" />
                Owner Details
              </h3>
              <p className="font-medium text-gray-800">{property.owner_name || 'Not specified'}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <FaEnvelope className="text-xs" />
                {property.owner_email || 'Not available'}
              </p>
            </div>

            {user && user.id === property.user_id && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-3">Manage Property</h3>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/properties/${property.id}/edit`}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition font-medium text-sm"
                  >
                    Edit Property
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-800">{property.title}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <FaMapMarkerAlt className="text-red-400" />
                {property.city}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  {property.property_type}
                </span>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaBed /> {property.bedrooms} BHK
                </span>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaCheckCircle /> Verified
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          </div>

          {/* Right - Inquiry Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaPhone className="text-red-500" />
                Contact Owner
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Fill in your details and the owner will get back to you
              </p>
              <InquiryForm propertyId={property.id} />
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4 text-center">
              <div className="flex justify-center gap-1 mb-1">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Trusted by 50,000+ customers</p>
              <p className="text-xs text-gray-500">100% verified properties</p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-8">
          <SimilarProperties propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}