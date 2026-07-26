'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import GradientCard from '@/components/GradientCard';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function Profile() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null && !localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    async function fetchCrafts() {
      const activeToken = token || localStorage.getItem('token');
      if (!activeToken) return;

      try {
        const res = await fetch(`${API_URL}/crafts`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCrafts(data);
        }
      } catch (err) {
        toast.error("Could not load your crafts.");
      } finally {
        setLoading(false);
      }
    }

    fetchCrafts();
  }, [user, token, router]);

  const handleDelete = async (craftId) => {
    const activeToken = token || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/crafts/${craftId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        setCrafts(prev => prev.filter(c => c._id !== craftId));
        toast.success("Removed from your collection.");
      }
    } catch (err) {
      toast.error("Could not delete craft.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-xl font-bold text-gray-400 animate-pulse">Loading your crafts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-center md:text-left">Ideas I've Saved</h1>
          <p className="text-gray-500 text-center md:text-left">{crafts.length} saved idea{crafts.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="bg-black text-white font-bold py-2 px-6 border-4 border-black hover:bg-white hover:text-black transition-colors whitespace-nowrap"
        >
          ← Back to Home
        </button>
      </div>

      {crafts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🌱</p>
          <p className="text-xl font-bold text-gray-600 mb-2">Nothing saved yet!</p>
          <p className="text-gray-400 mb-6">Generate some craft ideas and click "Save Idea" right from the grid.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white font-bold py-2 px-6 border-4 border-black hover:bg-white hover:text-black transition-colors"
          >
            Start Crafting
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {crafts.map(craft => (
            <div key={craft._id} className="break-inside-avoid bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform overflow-hidden relative group">
              <button
                onClick={() => handleDelete(craft._id)}
                className="absolute top-2 right-2 z-10 bg-white border-2 border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
              >
                <X size={14} />
              </button>
              <GradientCard emoji={craft.emoji} gradient={craft.gradient} size="md" className="border-b-4 border-black" />
              <div className="p-4">
                <h3 className="text-lg font-black leading-tight">{craft.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
