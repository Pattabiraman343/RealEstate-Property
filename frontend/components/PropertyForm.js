// components/PropertyForm.js
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { propertyAPI } from '@/lib/api';
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaBed, 
  FaBuilding, 
  FaImage,
  FaUpload,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';

export default function PropertyForm({ property, isEdit = false }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(property?.image_url 
    ? `https://realestate-property-jq22.onrender.com${property.image_url}` 
    : null);  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    city: property?.city || '',
    property_type: property?.property_type || '',
    bedrooms: property?.bedrooms || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload JPEG, PNG, WEBP image');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.property_type) {
      newErrors.property_type = 'Property type is required';
    }

    if (!formData.bedrooms && formData.bedrooms !== '0') {
      newErrors.bedrooms = 'Bedrooms is required';
    } else if (Number(formData.bedrooms) < 0) {
      newErrors.bedrooms = 'Bedrooms cannot be negative';
    } else if (Number(formData.bedrooms) > 10) {
      newErrors.bedrooms = 'Bedrooms cannot exceed 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate before submission
    if (!validateForm()) {
      // Show first error in toast
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('property_type', formData.property_type);
      formDataToSend.append('bedrooms', formData.bedrooms);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (isEdit && property?.id) {
        response = await propertyAPI.update(property.id, formDataToSend);
      } else {
        response = await propertyAPI.create(formDataToSend);
      }

      toast.success(response.data.message);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Submit error:', error);
      
      // ✅ Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const errorMessages = backendErrors.map(err => err.msg).join(', ');
        toast.error(errorMessages);
        
        // Map backend errors to fields
        const fieldErrors = {};
        backendErrors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path] = err.msg;
          }
        });
        setErrors(fieldErrors);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save property');
      }
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    { value: 'Apartment', icon: '🏢', label: 'Apartment' },
    { value: 'House', icon: '🏠', label: 'House' },
    { value: 'Villa', icon: '🏘️', label: 'Villa' },
    { value: 'Plot', icon: '📐', label: 'Plot' },
    { value: 'Commercial', icon: '🏬', label: 'Commercial' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Property' : 'List Your Property'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? 'Update your property details' : 'Fill in the details to list your property'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Luxury 3 BHK Apartment in Anna Nagar"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-700 ${
                errors.title 
                  ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-red-400 focus:border-red-400'
              }`}
            />
            {errors.title ? (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.title}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Minimum 5 characters, maximum 100 characters</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property in detail..."
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-700 resize-none ${
                errors.description 
                  ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-red-400 focus:border-red-400'
              }`}
            />
            {errors.description ? (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.description}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Minimum 20 characters</p>
            )}
          </div>

          {/* Price & City Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <FaRupeeSign className="inline mr-1 text-red-500" />
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-700 ${
                  errors.price 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:ring-red-400 focus:border-red-400'
                }`}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <FaMapMarkerAlt className="inline mr-1 text-red-500" />
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-700 ${
                  errors.city 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:ring-red-400 focus:border-red-400'
                }`}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.city}
                </p>
              )}
            </div>
          </div>

          {/* Property Type & Bedrooms Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <FaBuilding className="inline mr-1 text-red-500" />
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="property_type"
                required
                value={formData.property_type}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-700 appearance-none bg-white ${
                  errors.property_type 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:ring-red-400 focus:border-red-400'
                }`}
              >
                <option value="">Select type</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.property_type && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.property_type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <FaBed className="inline mr-1 text-red-500" />
                Bedrooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bedrooms"
                required
                min="0"
                max="10"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Number of bedrooms"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-700 ${
                  errors.bedrooms 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:ring-red-400 focus:border-red-400'
                }`}
              />
              {errors.bedrooms && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.bedrooms}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <FaImage className="inline mr-1 text-red-500" />
              Property Image
              {!isEdit && <span className="text-xs text-gray-400 ml-1">(Optional)</span>}
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Property preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-md"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Click the X to remove image</p>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 hover:bg-red-50 transition cursor-pointer"
              >
                <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
            
            {property?.image_url && !imageFile && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <FaCheckCircle /> Current image saved
              </p>
            )}
          </div>
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-red-600 text-white px-8 py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {isEdit ? 'Update Property' : 'List Property'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}