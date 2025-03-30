'use client';

import Link from 'next/link';
import { RxAvatar } from 'react-icons/rx';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check auth state and subscribe to changes
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) setUserEmail(user.email || '');
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
      setUserEmail(session?.user?.email || '');
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setShowDropdown(false);
  };

  const handleHomepage = () => {
    router.push('/');
    setShowDropdown(false);
  };

  const handleDashboard = () => {
    router.push('/user');
    setShowDropdown(false);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md relative">
      {/* Website Name */}
      <Link href="/" className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors">
        Ever Want Advertisement
      </Link>

      {/* Auth Section */}
      <div className="relative">
        {isLoading ? (
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
        ) : isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-gray-600 truncate max-w-[120px]">
              {userEmail}
            </div>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="User menu"
              >
                <RxAvatar className="text-2xl text-gray-700" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-2 text-xs text-gray-500 truncate border-b border-gray-100">
                    {userEmail}
                  </div>
                  <button
                    onClick={handleHomepage}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Homepage
                  </button>
                  <button
                    onClick={handleDashboard}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link href="/login">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}