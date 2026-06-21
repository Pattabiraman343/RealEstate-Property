// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

// ✅ SEO: Global metadata
export const metadata = {
  title: {
    default: 'RealEstate - Find Your Dream Property',
    template: '%s | RealEstate'
  },
  description: 'Discover thousands of properties for sale and rent across India. Find apartments, houses, villas, and commercial spaces.',
  keywords: 'real estate, properties, homes, apartments, villas, commercial, buy, rent, India',
  authors: [{ name: 'RealEstate' }],
  creator: 'RealEstate',
  publisher: 'RealEstate',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'RealEstate - Find Your Dream Property',
    description: 'Discover thousands of properties for sale and rent across India.',
    url: 'https://realestate.com',
    siteName: 'RealEstate',
    images: [
      {
        url: 'https://realestate.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RealEstate - Find Your Dream Property',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealEstate - Find Your Dream Property',
    description: 'Discover thousands of properties for sale and rent across India.',
    images: ['https://realestate.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://realestate.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-800 text-white text-center py-4">
              <p>© 2026 RealEstate. All rights reserved.</p>
            </footer>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}