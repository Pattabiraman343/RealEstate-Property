// lib/imageHelper.js
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
    : 'https://realestate-property-jq22.onrender.com';
  
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('uploads/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  return `${BASE_URL}/uploads/${imagePath}`;
};