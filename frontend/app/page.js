'use client';

import Link from 'next/link';
import { 
  FaHome, 
  FaSearch, 
  FaHandshake, 
  FaShieldAlt, 
  FaBuilding,
  FaChevronRight,
  FaStar,
  FaUsers,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-4">
              🏆 India's Trusted Real Estate Platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Find Your <span className="text-yellow-300">Dream Property</span>
            </h1>
            <p className="text-lg md:text-xl text-red-100 mb-8 max-w-2xl">
              Discover thousands of verified properties for sale and rent across India. 
              Buy, sell, or rent with confidence.
            </p>
            
            <div className="bg-white rounded-xl shadow-2xl p-2 max-w-2xl flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search by city, locality..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2 whitespace-nowrap">
                <FaSearch /> Search
              </button>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-red-100">
              <span className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                50,000+ Properties
              </span>
              <span className="flex items-center gap-2">
                <FaUsers className="text-yellow-300" />
                10,000+ Happy Customers
              </span>
              <span className="flex items-center gap-2">
                <FaGlobe className="text-yellow-300" />
                100+ Cities
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-red-600">50K+</p>
              <p className="text-sm text-gray-500">Properties Listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">10K+</p>
              <p className="text-sm text-gray-500">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">100+</p>
              <p className="text-sm text-gray-500">Cities Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">4.8★</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">How It Works</h2>
            <p className="text-gray-500 mt-2">Three simple steps to find your dream property</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                icon: <FaSearch className="text-3xl" />,
                title: 'Search',
                desc: 'Browse thousands of properties by city, type, or budget'
              },
              {
                step: '02',
                icon: <FaHandshake className="text-3xl" />,
                title: 'Connect',
                desc: 'Contact owners directly and schedule visits'
              },
              {
                step: '03',
                icon: <FaHome className="text-3xl" />,
                title: 'Move In',
                desc: 'Find your dream home and make it yours'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition group">
                <div className="relative">
                  <span className="absolute -top-4 -left-4 text-6xl font-bold text-red-100 opacity-50">
                    {item.step}
                  </span>
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Platform Features</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: FaHome, title: 'Wide Selection', desc: 'Thousands of verified properties across India', color: 'red' },
              { icon: FaSearch, title: 'Easy Search', desc: 'Advanced filters to find exactly what you want', color: 'blue' },
              { icon: FaHandshake, title: 'Trusted Platform', desc: '100% verified listings and genuine owners', color: 'green' },
              { icon: FaShieldAlt, title: 'Secure & Safe', desc: 'Your data and transactions are protected', color: 'purple' },
            ].map((feature, i) => {
              const colors = {
                red: 'bg-red-50 text-red-600',
                blue: 'bg-blue-50 text-blue-600',
                green: 'bg-green-50 text-green-600',
                purple: 'bg-purple-50 text-purple-600',
              };
              return (
                <div key={i} className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition border border-gray-100">
                  <div className={`w-14 h-14 ${colors[feature.color]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="text-2xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who found their dream home with us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={user ? '/properties' : '/register'} 
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition flex items-center gap-2"
            >
              {user ? 'Browse Properties' : 'Get Started Free'} <FaArrowRight />
            </Link>
            <Link 
              href="/properties" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Rahul Sharma',
                location: 'Mumbai',
                text: 'Found my dream apartment within a week! The platform is amazing.',
                rating: 5
              },
              {
                name: 'Priya Patel',
                location: 'Bangalore',
                text: 'Selling my property was so easy. Got genuine buyers quickly.',
                rating: 5
              },
              {
                name: 'Amit Kumar',
                location: 'Delhi',
                text: 'Best real estate platform in India. Highly recommended!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}