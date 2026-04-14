import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary-600 rounded-xl text-white">
                <Plane className="w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-tight">
                TripOnBudget
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Explore the world without breaking the bank. We offer the best affordable travel packages.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link to="/packages" className="hover:text-primary-500 transition-colors">Travel Packages</Link></li>
              <li><Link to="/blog" className="hover:text-primary-500 transition-colors">Travel Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin" className="hover:text-primary-500 transition-colors text-primary-400 font-medium">Admin Dashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Categories</h3>
            <ul className="space-y-4">
              <li><Link to="/packages?category=Domestic" className="hover:text-primary-500 transition-colors">Domestic Trips</Link></li>
              <li><Link to="/packages?category=Adventure" className="hover:text-primary-500 transition-colors">Adventure Trips</Link></li>
              <li><Link to="/packages?category=Spiritual" className="hover:text-primary-500 transition-colors">Spiritual Packages</Link></li>
              <li><Link to="/packages?category=Weekend" className="hover:text-primary-500 transition-colors">Weekend Getaways</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-1" />
                <span>Ballabgarh, Faridabad, Haryana</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <a href="tel:+917827916794" className="hover:text-primary-500 transition-colors">+91 78279 16794</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <a href="mailto:padatvivek2@gmail.com" className="hover:text-primary-500 transition-colors">padatvivek2@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TripOnBudget. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
