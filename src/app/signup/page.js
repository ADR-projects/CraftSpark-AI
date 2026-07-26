'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        router.push('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-amber-50 p-4">
      <div className="bg-cyan-300 border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h2 className="text-4xl font-black mb-6 text-center">Sign Up</h2>
        {error && <p className="bg-red-400 text-white font-bold p-3 border-4 border-black mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="p-3 border-4 border-black font-bold outline-none focus:bg-pink-100 transition-colors"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 border-4 border-black font-bold outline-none focus:bg-amber-100 transition-colors"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-black text-white font-black py-4 border-4 border-black hover:bg-white hover:text-black transition-colors mt-4 text-xl">
            JOIN NOW 🎨
          </button>
        </form>
        <p className="mt-6 text-center font-bold">
          Already have an account? <Link href="/login" className="text-blue-800 underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
