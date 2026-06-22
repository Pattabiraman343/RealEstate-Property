export const generatePropertySEO = (property) => {
    if (!property) return null;
  
    const title = `${property.title} | RealEstate`;
    const description = property.description?.slice(0, 160) || `Find this ${property.property_type} in ${property.city} at ₹${property.price}`;
    const imageUrl = property.image_url ? `https://realestate.com${property.image_url}` : 'https://realestate.com/default-image.jpg';
    const url = `https://realestate.com/properties/${property.id}`;
  
    return {
      title,
      description,
      keywords: `${property.property_type}, ${property.city}, real estate, property for sale, ${property.bedrooms} BHK`,
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
        'article:published_time': property.created_at,
        'article:modified_time': property.updated_at || property.created_at,
        'article:tag': [property.property_type, property.city, `${property.bedrooms} BHK`],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description,
        url: url,
        image: imageUrl,
        price: property.price,
        priceCurrency: 'INR',
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.city,
          addressCountry: 'IN',
        },
        numberOfRooms: property.bedrooms,
        propertyType: property.property_type,
        datePosted: property.created_at,
      },
    };
  };