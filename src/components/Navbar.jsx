'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="py-2 px-4 flex justify-end items-center gap-3 z-10 relative">
      {user ? (
        <>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 text-sm"
          >
            Log Out
          </button>
          <Link href="/settings">
            <button className="text-gray-500 hover:text-black font-medium transition-colors px-3 py-1.5 text-sm hover:underline">
              Settings
            </button>
          </Link>
          <Link href="/profile">
            <button className="text-gray-600 hover:text-black font-medium transition-colors px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:border-gray-500">
              My Profile
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/login">
            <button className="text-gray-500 hover:text-black transition-colors px-3 py-1 text-sm">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="text-amber-800 font-medium py-1.5 px-4 rounded-full border border-amber-300 hover:bg-amber-100 transition-colors text-sm">
              Sign Up
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
