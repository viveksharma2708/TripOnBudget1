import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Calendar, DollarSign, Star, ArrowRight } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { useTestimonials } from '../context/TestimonialContext';
import { categories } from '../data/mockData';
import { cn } from '../lib/utils';

export default function Home() {
  const { packages } = usePackages();
  const { testimonials } = useTestimonials();
  const [searchQuery, setSearchQuery] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const featuredPackages = packages.slice(0, 3);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const visibleTestimonials = testimonials.length > 0 ? [
    testimonials[testimonialIndex % testimonials.length],
    testimonials[(testimonialIndex + 1) % testimonials.length],
    testimonials[(testimonialIndex + 2) % testimonials.length]
  ] : [];

  return (
    <div className="w-full">
      <Helmet>
        <title>TripOnBudget | Affordable Travel Packages</title>
        <meta name="description" content="Discover the best budget-friendly travel packages for your next adventure. Explore India and beyond with TripOnBudget." />
        <meta property="og:title" content="TripOnBudget | Affordable Travel Packages" />
        <meta property="og:description" content="Discover the best budget-friendly travel packages for your next adventure. Explore India and beyond with TripOnBudget." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000" 
            alt="Travel Background India" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
              Explore Incredible India <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-300">
                Without Breaking the Bank
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto">
              Discover breathtaking destinations, curated itineraries, and unforgettable experiences tailored perfectly for your budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Choose Your Vibe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our handpicked categories for your next adventure.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/packages?category=${category.name}`} className="group block relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/5]">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-white font-heading font-semibold text-xl md:text-2xl">{category.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Featured Budget Trips</h2>
              <p className="text-gray-600 max-w-2xl">Premium experiences curated for your budget.</p>
            </div>
            <Link to="/packages" className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {pkg.rating}
                  </div>
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {pkg.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{pkg.location}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {pkg.title}
                  </h3>
                  <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{pkg.price.toLocaleString('en-IN')}
                        <span className="text-sm font-normal text-gray-500">/person</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link 
                        to={`/packages/${pkg.id}`}
                        className="bg-gray-100 text-gray-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                      >
                        Details
                      </Link>
                      <Link 
                        to={`/packages/${pkg.id}?book=true`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors text-center"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/packages" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              View All Packages <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Loved by Travelers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. See what our happy customers have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${testimonialIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-primary-100 relative"
              >
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Ready for your next adventure?</h2>
          <p className="text-xl text-primary-100 mb-10">Join thousands of travelers who have explored the world on a budget with us.</p>
          <Link 
            to="/packages" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-600 bg-white rounded-full hover:bg-gray-50 hover:scale-105 transition-all shadow-xl"
          >
            Plan Your Trip Now
          </Link>
        </div>
      </section>
    </div>
  );
}
