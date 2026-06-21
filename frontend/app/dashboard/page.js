// app/dashboard/page.js
'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyAPI, inquiryAPI } from '@/lib/api';
import { 
  FaPlus, 
  FaHome, 
  FaEnvelope, 
  FaEdit, 
  FaTrash,
  FaEye,
  FaBed,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBuilding,
  FaPhone
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalInquiries: 0
  });
  const [activeTab, setActiveTab] = useState('properties');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ CORRECT: Using getMy() to get ONLY user's properties
      console.log('📊 Fetching MY properties...');
      const propertiesRes = await propertyAPI.getMy();  // ← This is correct!
      console.log('📊 Properties response:', propertiesRes.data);
      
      const userProperties = propertiesRes.data.data || [];
      console.log(`📊 Found ${userProperties.length} properties for user:`, user?.name);
      
      setProperties(userProperties);
      setStats(prev => ({
        ...prev,
        totalProperties: userProperties.length
      }));

      // Fetch inquiries for each property
      let allInquiries = [];
      for (const prop of userProperties) {
        try {
          const inquiryRes = await inquiryAPI.getByProperty(prop.id);
          const propInquiries = inquiryRes.data.data || [];
          allInquiries = [...allInquiries, ...propInquiries.map(inq => ({
            ...inq,
            property_title: prop.title
          }))];
        } catch (error) {
          console.error(`Failed to fetch inquiries for property ${prop.id}:`, error);
        }
      }
      setInquiries(allInquiries);
      setStats(prev => ({
        ...prev,
        totalInquiries: allInquiries.length
      }));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await propertyAPI.delete(propertyId);
      toast.success('Property deleted successfully');
      setProperties(properties.filter(p => p.id !== propertyId));
      setStats(prev => ({
        ...prev,
        totalProperties: prev.totalProperties - 1
      }));
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    const num = Number(price);
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
    return num.toLocaleString();
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your properties and inquiries from one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalProperties}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaHome className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Inquiries</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalInquiries}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaEnvelope className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quick Action</p>
              <Link
                href="/properties/create"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <FaPlus size={14} />
                Add New Property
              </Link>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaBuilding className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'properties'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaHome className="inline mr-2" />
              My Properties ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'inquiries'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaEnvelope className="inline mr-2" />
              Inquiries ({inquiries.length})
            </button>
          </nav>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="p-6">
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Properties Listed
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't listed any properties yet.
                </p>
                <Link
                  href="/properties/create"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaPlus />
                  List Your First Property
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {property.image_url ? (
                          <img
                            src={`http://localhost:5000${property.image_url}`}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <FaMapMarkerAlt className="text-blue-500" />
                          {property.city}
                        </p>
                        <p className="text-blue-600 font-bold flex items-center gap-1">
                          <FaRupeeSign size={14} />
                          {formatPrice(property.price)}
                        </p>
                        <div className="flex gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <FaBed /> {property.bedrooms} BHK
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {property.property_type}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row md:flex-col gap-2 items-start">
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                          <FaEye /> View
                        </Link>
                        <Link
                          href={`/properties/${property.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="p-6">
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Inquiries
                </h3>
                <p className="text-gray-500">
                  You haven't received any inquiries for your properties yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-semibold text-gray-700 text-lg">
                            {inquiry.name}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm flex items-center gap-1">
                            <FaPhone className="text-xs" />
                            {inquiry.phone}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Property:</span>{' '}
                          {inquiry.property_title}
                        </p>
                        <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                          "{inquiry.message}"
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}