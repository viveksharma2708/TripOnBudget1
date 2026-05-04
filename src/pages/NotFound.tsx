import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8 text-primary-600">
            <span className="text-4xl font-black">404</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The destination you're looking for seems to have moved or doesn't exist. Let's get you back on track.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              to="/" 
              className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>
        
        <p className="mt-8 text-sm text-gray-400 font-medium tracking-wide flex items-center justify-center gap-2">
          TripOnBudget • Travel with Confidence
        </p>
      </div>
    </div>
  );
}
