'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function Settings() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (user === null && !localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [user, router]);

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    const activeToken = token || localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/auth/account`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      
      if (res.ok) {
        toast.success('Your account and all saved crafts have been deleted.');
        logout();
        router.push('/');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete account.');
        setIsDeleting(false);
      }
    } catch (err) {
      toast.error('Network error while deleting account.');
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 border-b-4 border-black pb-4">Settings ⚙️</h2>
        
        <div className="mb-8">
          <p className="font-bold text-gray-700 mb-2">Logged in as:</p>
          <p className="text-xl break-all">{user.email}</p>
        </div>

        <div className="border-t-4 border-red-500 pt-6">
          <h3 className="text-xl font-black text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. All of your saved crafts will be permanently erased.
          </p>
          
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className={`w-full font-bold py-3 px-4 border-4 border-red-600 transition-colors
              ${confirmDelete 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-white text-red-600 hover:bg-red-50"
              }
              ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isDeleting 
              ? "Deleting..." 
              : confirmDelete 
                ? "Yes, permanently delete my account" 
                : "Delete Account"
            }
          </button>
          
          {confirmDelete && !isDeleting && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-full mt-3 font-bold py-2 text-gray-500 hover:text-black transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
