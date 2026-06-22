'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  FaPlus, 
  FaSignOutAlt, 
  FaHome, 
  FaTachometerAlt,
  FaBuilding,
  FaUser,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
 
  const isDashboard = pathname === '/dashboard';
  const isActive = (path) => pathname === path;

  useEffect(() => {
    console.log('Header - isAuthenticated:', isAuthenticated);
    console.log(' Header - user:', user);
  }, [isAuthenticated, user]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 text-white p-1.5 rounded-lg">
              <FaBuilding size={18} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Real<span className="text-red-600">Estate</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/properties" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                isActive('/properties') 
                  ? 'bg-red-50 text-red-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
              }`}
            >
              <FaHome size={14} />
              Properties
            </Link>
            
            {isAuthenticated && user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive('/dashboard') 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                  }`}
                >
                  <FaTachometerAlt size={14} />
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition">
              <FaSearch className="text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search properties..."
                className="bg-transparent outline-none px-2 py-1 text-sm w-40 focus:w-48 transition-all"
              />
            </div>

            {isAuthenticated && user ? (
              <>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                  <FaBell className="text-gray-600" size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                </button>

                <Link 
                  href="/properties/create" 
                  className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
                >
                  <FaPlus size={14} />
                  Add Property
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.name?.split(' ')[0]}
                    </span>
                    <FaChevronDown 
                      className={`text-gray-400 text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link 
                          href="/dashboard" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaTachometerAlt size={14} />
                          Dashboard
                        </Link>
                        <Link 
                          href="/properties/my" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaHome size={14} />
                          My Properties
                        </Link>
                        <Link 
                          href="/properties/create" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaPlus size={14} />
                          Add Property
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full"
                        >
                          <FaSignOutAlt size={14} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition px-3 py-2"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
                >
                  Sign Up Free
                </Link>
              </>
            )}

        
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-gray-600" size={20} />
              ) : (
                <FaBars className="text-gray-600" size={20} />
              )}
            </button>
          </div>
        </div>


        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-1">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </>
            ) : null}

            <Link 
              href="/properties" 
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome size={16} />
              Properties
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTachometerAlt size={16} />
                  Dashboard
                </Link>
                <Link 
                  href="/properties/create" 
                  className="flex items-center gap-3 px-4 py-3 text-white bg-red-600 rounded-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaPlus size={16} />
                  Add Property
                </Link>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser size={16} />
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="flex items-center gap-3 px-4 py-3 text-white bg-red-600 rounded-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              </>
            )}

            
            <div className="px-4 py-3">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <FaSearch className="text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="bg-transparent outline-none px-2 py-1 text-sm w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}