'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { propertyAPI } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import Loading from '@/components/Loading';
import { 
  FaSearch, FaFilter, FaTimes, FaAd, FaHome, FaBuilding,
  FaBed, FaMapMarkerAlt, FaChevronDown, FaChevronUp, 
  FaRupeeSign, FaStar, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

function PropertiesContent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 4,
    totalPages: 0
  });
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    price: true,
    bedrooms: true,
  });
  
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    sort: 'created_at_desc',
    page: 1,
    limit: 4
  });
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      params.limit = 4;
      
      console.log(' Fetching with params:', params);
      
      let response;
      const hasFilters = Object.keys(params).some(key => 
        key !== 'limit' && key !== 'page' && params[key]
      );
      
      if (!hasFilters) {
        response = await propertyAPI.getAll();
        console.log('Using getAll() - no filters');
      } else {
        response = await propertyAPI.search(params);
        console.log('Using search() with filters');
      }
      
      console.log(' Response:', response.data);
      
      let data = [];
      let paginationData = { total: 0, page: 1, limit: 4, totalPages: 0 };
      
      if (response.data?.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      if (response.data?.pagination) {
        paginationData = response.data.pagination;
      }
      
      if (data.length === 0) {
        paginationData.total = 0;
        paginationData.totalPages = 0;
      } else if (paginationData.total === 0) {
        paginationData.total = data.length;
        paginationData.totalPages = Math.ceil(data.length / paginationData.limit);
      }
      
      setProperties(data);
      setPagination(paginationData);
    } catch (error) {
      console.error('❌ Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        params.append(key, value);
      }
    });
    
    params.set('limit', '4');
    params.set('page', '1');
    
    router.push(`/properties?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      property_type: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      sort: 'created_at_desc',
      page: 1,
      limit: 4
    });
    router.push('/properties');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    params.set('limit', '4');
    router.push(`/properties?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const propertyTypes = [
    { label: 'Apartment', count: 12, icon: '🏢', value: 'Apartment' },
    { label: 'House', count: 8, icon: '🏠', value: 'House' },
    { label: 'Villa', count: 5, icon: '🏘️', value: 'Villa' },
    { label: 'Plot', count: 3, icon: '📐', value: 'Plot' },
    { label: 'Commercial', count: 4, icon: '🏬', value: 'Commercial' }
  ];

  const bedroomOptions = [
    { label: '1 BHK', value: '1' },
    { label: '2 BHK', value: '2' },
    { label: '3 BHK', value: '3' },
    { label: '4 BHK', value: '4' },
    { label: '5+ BHK', value: '5' }
  ];

  const sortOptions = [
    { value: 'created_at_desc', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages = [];
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Find Your Dream Property</h1>
          <p className="text-red-100 mt-1">
            Browse through {pagination.total || properties.length} properties across India
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="hidden lg:block mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city, location, or property name..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
              </div>
              <button
                onClick={applyFilters}
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2"
              >
                <FaSearch /> Search
              </button>
              <button
                onClick={clearFilters}
                className="border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex flex-col gap-3 mb-4">
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition"
            >
              <FaFilter className="text-red-500" />
              Filters
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(v => v && v !== '').length}
              </span>
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
            >
              <FaSearch /> Search
            </button>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city..."
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={`
            lg:w-80 flex-shrink-0
            ${showFilters ? 'fixed inset-0 z-50 bg-black bg-opacity-50' : 'hidden lg:block'}
          `}>
            {showFilters && (
              <div className="absolute inset-0" onClick={() => setShowFilters(false)} />
            )}

            <div className={`
              ${showFilters ? 'absolute inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto' : 'relative'}
              lg:static lg:w-full lg:shadow-none lg:overflow-visible
              rounded-lg lg:rounded-none
            `}>
              {showFilters && (
                <div className="flex justify-between items-center p-4 border-b lg:hidden">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <FaTimes className="text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Reset All
                  </button>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <label className="font-semibold text-gray-700 block mb-2">Search Location</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Enter city name..."
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                    />
                  </div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('type')}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="font-semibold text-gray-700">Property Type</span>
                    {expandedSections.type ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  {expandedSections.type && (
                    <div className="mt-2 space-y-1">
                      {propertyTypes.map((type) => (
                        <label 
                          key={type.label} 
                          className={`flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition ${
                            filters.property_type === type.value 
                              ? 'bg-red-50 text-red-600' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleFilterChange('property_type', 
                            filters.property_type === type.value ? '' : type.value
                          )}
                        >
                          <span className="flex items-center gap-2 text-sm">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {type.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="font-semibold text-gray-700">Price Range</span>
                    {expandedSections.price ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  {expandedSections.price && (
                    <div className="mt-2 flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Min</label>
                        <div className="flex items-center border rounded-lg px-2 py-1 bg-gray-50">
                          <FaRupeeSign className="text-gray-400 text-xs" />
                          <input
                            type="number"
                            placeholder="0"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="w-full bg-transparent outline-none text-sm px-1"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Max</label>
                        <div className="flex items-center border rounded-lg px-2 py-1 bg-gray-50">
                          <FaRupeeSign className="text-gray-400 text-xs" />
                          <input
                            type="number"
                            placeholder="Any"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="w-full bg-transparent outline-none text-sm px-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('bedrooms')}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="font-semibold text-gray-700">Bedrooms</span>
                    {expandedSections.bedrooms ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  {expandedSections.bedrooms && (
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {bedroomOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('bedrooms', 
                            filters.bedrooms === option.value ? '' : option.value
                          )}
                          className={`py-1.5 text-sm rounded border transition ${
                            filters.bedrooms === option.value
                              ? 'border-red-500 bg-red-50 text-red-600'
                              : 'border-gray-200 hover:border-red-300 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pb-2">
                  <label className="font-semibold text-gray-700 block mb-2">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaSearch /> Apply Filters
                </button>
              </div>
            </div>
          </aside>

        
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex flex-wrap items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Showing</span>
                <span className="font-semibold text-gray-800 mx-1">{properties.length}</span>
                <span className="text-sm text-gray-500">of {pagination.total} properties</span>
                {filters.city && (
                  <span className="ml-2 text-sm text-red-500">
                    in <span className="font-medium">{filters.city}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 hidden sm:inline">Sort:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => {
                    handleFilterChange('sort', e.target.value);
                    const params = new URLSearchParams(searchParams);
                    params.set('sort', e.target.value);
                    params.set('limit', '4');
                    router.push(`/properties?${params.toString()}`);
                  }}
                  className="border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FaHome className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">No Properties Found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-red-500 hover:text-red-600 font-medium"
                >
                  Clear all filters →
                </button>
              </div>
            ) : (
              <>
            
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 max-h-[calc(100vh-60px)] overflow-y-auto pr-2 custom-scrollbar">
  {properties.map((property) => (
    <div key={property.id} className="h-full">
      <PropertyCard property={property} />
    </div>
  ))}
</div>
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`px-3 py-2 rounded-lg border transition ${
                        pagination.page === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-red-400'
                      }`}
                    >
                      <FaChevronLeft size={14} />
                    </button>

                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={index} className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            pagination.page === page
                              ? 'bg-red-600 text-white border-red-600'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-red-400'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={`px-3 py-2 rounded-lg border transition ${
                        pagination.page === pagination.totalPages
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-red-400'
                      }`}
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          <aside className="hidden xl:block w-64 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 text-center">
                <p className="text-xs uppercase tracking-wider font-semibold">Premium Listing</p>
              </div>
              <div className="p-4 text-center">
                <FaBuilding className="text-3xl text-red-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Get Featured</p>
                <p className="text-xs text-gray-500 mb-3">Reach 10x more buyers</p>
                <button className="w-full bg-red-600 text-white py-1.5 rounded text-sm hover:bg-red-700 transition">
                  List Now
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <FaAd className="text-red-400" />
                <span className="text-xs uppercase font-semibold text-gray-400">Sponsor</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <FaHome className="text-3xl text-gray-300 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-700">Home Loan @ 8.5%</p>
                <p className="text-xs text-gray-500">Get pre-approved</p>
              </div>
              <button className="w-full mt-2 text-red-500 text-sm font-medium hover:text-red-600">
                Learn More →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-700 text-sm mb-2">💡 Quick Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  Verify property documents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  Compare similar properties
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  Negotiate the best price
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="flex justify-center gap-1 mb-1">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">4.8/5 Rating</p>
              <p className="text-xs text-gray-500">Trusted by 50,000+ customers</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PropertiesContent />
    </Suspense>
  );
}