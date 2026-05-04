import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917827916794?text=Hi%20TripOnBudget,%20I%20am%20looking%20for%20a%20trip!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#25D366] text-white p-2.5 rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="absolute right-full mr-4 bg-white text-gray-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-gray-100">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
}
