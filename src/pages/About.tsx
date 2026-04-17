import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Shield, Heart, Globe, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24 pb-20 bg-white">
      <Helmet>
        <title>About Us | TripOnBudget</title>
        <meta name="description" content="Learn more about TripOnBudget. We believe that exploring the world shouldn't cost a fortune. We curate premium travel experiences at prices that make sense." />
        <meta property="og:title" content="About Us | TripOnBudget" />
        <meta property="og:description" content="Learn more about TripOnBudget. We believe that exploring the world shouldn't cost a fortune. We curate premium travel experiences at prices that make sense." />
      </Helmet>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6"
        >
          Making Travel <span className="text-primary-600">Accessible</span> for Everyone
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          At TripOnBudget, we believe that exploring the world shouldn't cost a fortune. 
          We curate premium travel experiences at prices that make sense.
        </motion.p>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 h-full rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000" 
              alt="Travelers" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000" 
                alt="Landscape" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1000" 
                alt="Culture" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Our Story</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Founded in 2023 by a group of passionate backpackers, TripOnBudget started with a simple realization: 
          most travel agencies mark up their packages significantly. We wanted to change that.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          By partnering directly with local hotels, guides, and transport providers, we cut out the middlemen. 
          This allows us to offer you the exact same premium experiences at a fraction of the cost. 
          Today, we've helped over 1000+ travelers discover new destinations without breaking the bank.
        </p>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best value and experience for every traveler.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">We guarantee the most competitive prices without compromising on quality.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Booking</h3>
              <p className="text-gray-600">Your payments and personal information are always safe with us.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Curated Trips</h3>
              <p className="text-gray-600">Every itinerary is hand-crafted by travel experts who know the destination.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated team is always available to assist you during your trip.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
