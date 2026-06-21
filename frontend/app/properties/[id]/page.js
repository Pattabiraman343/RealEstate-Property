// app/properties/[id]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PropertyDetailClient from './client';

// ✅ Use fetch directly
async function getProperty(id) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://realestate-property-jq22.onrender.com/api';
    const res = await fetch(`${API_URL}/properties/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch property:', error.message);
    return null;
  }
}

// ✅ SEO: Generate metadata
export async function generateMetadata({ params }) {
  try {
    const property = await getProperty(params.id);
    
    if (!property) {
      return {
        title: 'Property Not Found | RealEstate',
        description: 'The property you are looking for does not exist.',
      };
    }

    const imageUrl = property.image_url 
      ? `https://realestate-property-jq22.onrender.com${property.image_url}` 
      : null;
    
    const price = Number(property.price).toLocaleString('en-IN');
    const title = `${property.title} | ${property.bedrooms} BHK ${property.property_type} in ${property.city}`;
    const description = property.description?.slice(0, 160) || 
      `Find this ${property.property_type} in ${property.city} at ₹${price}.`;

    return {
      title,
      description,
      keywords: `${property.property_type}, ${property.city}, real estate, property for sale, ${property.bedrooms} BHK`,
      openGraph: {
        title,
        description,
        url: `https://real-estate-property.vercel.app/properties/${property.id}`,
        type: 'article',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: property.title }],
        'article:published_time': property.created_at,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://real-estate-property.vercel.app/properties/${property.id}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Property Details | RealEstate',
      description: 'View property details on RealEstate.',
    };
  }
}

// ✅ ISR: Revalidate every 60 seconds
export const revalidate = 60;

// ✅ Server Component
export default async function PropertyDetailPage({ params }) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  // ✅ Structured Data - FIXED
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `https://real-estate-property.vercel.app/properties/${property.id}`,
    image: property.image_url ? `https://realestate-property-jq22.onrender.com${property.image_url}` : undefined,
    price: Number(property.price),
    priceCurrency: 'INR',
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressCountry: 'IN',
    },
    numberOfRooms: property.bedrooms,
    propertyType: property.property_type,
    datePosted: property.created_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <PropertyDetailClient property={property} />
    </>
  );
}