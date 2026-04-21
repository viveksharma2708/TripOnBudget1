import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Calendar, Star, Filter } from 'lucide-react';
import { usePackages } from '../context/PackageContext';

export default function Packages() {
  const { packages } = usePackages();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'All';
  
  // Selected state (for radio buttons)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  
  // Applied state (for actual filtering)
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState('All');

  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
      setActiveCategory(categoryQuery);
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    setActiveCategory(selectedCategory);
    setPriceRange(selectedPriceRange);
    
    if (selectedCategory === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', selectedCategory);
    }
    setSearchParams(searchParams);
  };

  const categories = ['All', 'Domestic', 'Adventure', 'Spiritual', 'Weekend trips', 'Heritage'];
  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹15,000', value: '0-15000' },
    { label: '₹15,000 - ₹30,000', value: '15000-30000' },
    { label: '₹30,000 - ₹50,000', value: '30000-50000' },
    { label: 'Above ₹50,000', value: '50000+' }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchCategory = activeCategory === 'All' || pkg.category === activeCategory;
    let matchPrice = true;
    
    if (priceRange !== 'All') {
      if (priceRange === '0-15000') matchPrice = pkg.price <= 15000;
      else if (priceRange === '15000-30000') matchPrice = pkg.price > 15000 && pkg.price <= 30000;
      else if (priceRange === '30000-50000') matchPrice = pkg.price > 30000 && pkg.price <= 50000;
      else if (priceRange === '50000+') matchPrice = pkg.price > 50000;
    }

    return matchCategory && matchPrice;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <Helmet>
        <title>Travel Packages | TripOnBudget</title>
        <meta name="description" content="Explore our wide range of budget-friendly travel packages. Filter by category, price, and destination to find your perfect trip." />
        <meta property="og:title" content="Travel Packages | TripOnBudget" />
        <meta property="og:description" content="Explore our wide range of budget-friendly travel packages. Filter by category, price, and destination to find your perfect trip." />
      </Helmet>
      {/* Header */}
      <div className="bg-primary-600 text-white py-16 mb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Explore Our Packages</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">Find the perfect getaway that fits your budget and style.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg">
            <Calendar className="w-5 h-5" />
            View My Bookings
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-6 text-gray-900">
                <Filter className="w-5 h-5" />
                Filters
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Budget</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="price" 
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        checked={selectedPriceRange === range.value}
                        onChange={() => setSelectedPriceRange(range.value)}
                      />
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleApplyFilters}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
              >
                OK
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">Showing <span className="font-bold text-gray-900">{filteredPackages.length}</span> packages</p>
            </div>

            {filteredPackages.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => { 
                    setSelectedCategory('All'); 
                    setSelectedPriceRange('All'); 
                    setActiveCategory('All'); 
                    setPriceRange('All'); 
                  }}
                  className="mt-6 text-primary-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden shrink-0">
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
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{pkg.location}</span>
                      </div>
                      <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">1 Person</p>
                          <p className="text-lg font-bold text-gray-900 leading-none">
                            ₹{ (pkg.singlePrice || pkg.price).toLocaleString('en-IN') }
                          </p>
                          <p className="text-[10px] text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] text-primary-600 uppercase font-bold">Group (Min 5)</p>
                          <p className="text-lg font-bold text-primary-600 leading-none">
                            ₹{ (pkg.groupPrice || pkg.price).toLocaleString('en-IN') }
                          </p>
                          <p className="text-[10px] text-gray-400">per person</p>
                        </div>
                        <div className="col-span-2 flex gap-2 mt-2">
                          <Link 
                            to={`/packages/${pkg.id}`}
                            className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors text-center"
                          >
                            Details
                          </Link>
                          <Link 
                            to={`/packages/${pkg.id}?book=true`}
                            className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors text-center"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
