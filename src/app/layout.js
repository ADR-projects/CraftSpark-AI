import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CraftSpark-AI',
  description: 'Discover fun DIY projects using materials you already have!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-amber-50`}>
        <AuthProvider>
          <Toaster position="bottom-center" toastOptions={{ duration: 3000, style: { fontWeight: 600, border: '2px solid #1e293b', borderRadius: '8px' }}} />
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <footer className="text-center py-4 text-xs text-gray-400 tracking-wide">
            reduce · reuse · recycle ♻️
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
