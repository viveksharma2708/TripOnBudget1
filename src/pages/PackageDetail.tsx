import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Calendar, Star, CheckCircle2, XCircle, Clock, Users, MessageCircle, X } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packages } = usePackages();
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const pkg = packages.find(p => p.id === id);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [travelers, setTravelers] = useState(1);
  const [bookingEmail, setBookingEmail] = useState(user?.email || '');
  const [bookingName, setBookingName] = useState(user?.name || '');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [travelersError, setTravelersError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      handleBookNowClick();
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setBookingEmail(user.email);
      setBookingName(user.name);
    }
  }, [user]);

  if (!pkg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
        <Link to="/packages" className="text-primary-600 hover:underline">Back to Packages</Link>
      </div>
    );
  }

  const handleBookNowClick = () => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/packages/${id}?book=true` } });
      return;
    }
    setIsBookingModalOpen(true);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setTravelersError('');
    setEmailError('');
    setNameError('');
    setPhoneError('');
    
    let isValid = true;

    if (!bookingName.trim()) {
      setNameError('Full name is required.');
      isValid = false;
    }

    if (!travelers || travelers < 1) {
      setTravelersError('Number of travelers must be at least 1.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!bookingEmail) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(bookingEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else if (user && bookingEmail !== user.email) {
      setEmailError('Booking email must match your logged-in account email.');
      isValid = false;
    }

    if (!isValid) return;

    if (!bookingPhone.trim()) {
      setPhoneError('Mobile number is required.');
      isValid = false;
    } else if (!/^\d{10}$/.test(bookingPhone.trim())) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    }

    if (!isValid) return;
    
    // Fake name detection: contains numbers, dummy words, or 1/2 char repetive names
    const hasNumbers = /\d/.test(bookingName);
    const isDummyWord = ['test', 'fake', 'dummy', 'none', 'null', 'abc'].includes(bookingName.trim().toLowerCase());
    const isTooShort = bookingName.trim().length < 3;
    const isFakeName = hasNumbers || isDummyWord || isTooShort;

    if (user && pkg) {
      const bookingData = {
        userId: user.id,
        userName: bookingName,
        userEmail: user.email,
        userPhone: bookingPhone,
        packageId: pkg.id,
        packageTitle: pkg.title,
        date: pkg.packageDate || 'TBA',
        travelers,
        totalAmount: pkg.price * travelers,
        isFakeName
      };
      await addBooking(bookingData);
      
      setIsBookingModalOpen(false);
      navigate('/booking-confirmation', { state: { bookingData } });
    }
  };

  const handleWhatsApp = () => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/packages/${id}` } });
      return;
    }
    const message = `Hi TripOnBudget! I would like to book the "${pkg.title}" package (₹${pkg.price}). Please help me with the next steps.`;
    window.open(`https://wa.me/917827916794?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-20 pb-20 bg-gray-50">
      <Helmet>
        <title>{pkg.title} | TripOnBudget</title>
        <meta name="description" content={pkg.description.substring(0, 160)} />
        <meta property="og:title" content={`${pkg.title} | TripOnBudget`} />
        <meta property="og:description" content={pkg.description.substring(0, 160)} />
        <meta property="og:image" content={pkg.image} />
      </Helmet>

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img 
          src={pkg.image} 
          alt={pkg.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {pkg.category}
            </span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{pkg.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{pkg.duration}</span>
            </div>
            {pkg.packageDate && (
              <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>Date: {pkg.packageDate}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            {pkg.title}
          </h1>
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-semibold">{pkg.rating}</span>
              <span className="ml-1 text-white/80 text-sm">({pkg.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Overview */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{pkg.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-900">{pkg.duration}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-500">Group Size</span>
                  <span className="font-semibold text-gray-900">Flexible</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="font-semibold text-gray-900">{pkg.location.split(',')[0]}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-500">Starts On</span>
                  <span className="font-semibold text-gray-900">{pkg.packageDate || 'Flexible'}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                    <Star className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-500">Rating</span>
                  <span className="font-semibold text-gray-900">{pkg.rating}/5.0</span>
                </div>
              </div>
            </section>

            {/* Itinerary */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">Itinerary</h2>
              <div className="space-y-8">
                {pkg.itinerary.map((item, index) => (
                  <div key={index} className="relative pl-8 md:pl-0">
                    <div className="md:grid md:grid-cols-[100px_1fr] gap-6">
                      {/* Timeline Line (Mobile) */}
                      <div className="absolute left-[11px] top-2 bottom-[-2rem] w-0.5 bg-gray-200 md:hidden last:hidden"></div>
                      
                      {/* Day Badge */}
                      <div className="relative z-10 mb-2 md:mb-0">
                        <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary-100 border-4 border-white flex items-center justify-center md:hidden">
                          <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        </div>
                        <span className="inline-block bg-primary-50 text-primary-700 font-bold px-4 py-2 rounded-xl text-sm">
                          Day {item.day}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="bg-gray-50 p-6 rounded-2xl">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">What's Included</h2>
                <ul className="space-y-4">
                  {pkg.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">What's Excluded</h2>
                <ul className="space-y-4">
                  {pkg.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Sidebar Pricing Card */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <div className="mb-6">
                <p className="text-gray-500 line-through text-lg">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>
                <div className="flex items-end gap-2">
                  <h2 className="text-4xl font-bold text-gray-900">₹{pkg.price.toLocaleString('en-IN')}</h2>
                  <span className="text-gray-500 mb-1">/ person</span>
                </div>
                <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Save ₹{(pkg.originalPrice - pkg.price).toLocaleString('en-IN')}!
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
                  <span>Base Price</span>
                  <span>₹{pkg.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
                  <span>Taxes & Fees</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                  <span>Total</span>
                  <span>₹{pkg.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleBookNowClick}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Book Now
                </button>
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#20bd5a] transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  Book on WhatsApp
                </button>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-6">
                No hidden fees. Secure booking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-2xl font-heading font-bold text-gray-900">Complete Booking</h3>
                  <button 
                    onClick={() => setIsBookingModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={submitBooking} className="p-6 space-y-6">
                    {bookingError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                        {bookingError}
                      </div>
                    )}
                    <div className="bg-primary-50 p-4 rounded-xl mb-6">
                      <h4 className="font-bold text-gray-900 mb-1">{pkg.title}</h4>
                      <p className="text-sm text-gray-600">{pkg.duration} • {pkg.location}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={travelers}
                          onChange={(e) => { setTravelers(parseInt(e.target.value)); setTravelersError(''); }}
                          className={`w-full px-4 py-3 rounded-xl border ${travelersError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} focus:ring-2 outline-none transition-colors`}
                        />
                        {travelersError && <p className="text-red-500 text-xs mt-1">{travelersError}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                        <input 
                          type="text"
                          readOnly
                          value={pkg.packageDate || 'TBA'}
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 font-medium outline-none cursor-not-allowed"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Fixed Date (Set by Admin)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={bookingName}
                        onChange={(e) => { setBookingName(e.target.value); setNameError(''); }}
                        className={`w-full px-4 py-3 rounded-xl border ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} focus:ring-2 outline-none transition-colors`}
                      />
                      {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={bookingEmail}
                        onChange={(e) => { setBookingEmail(e.target.value); setEmailError(''); }}
                        className={`w-full px-4 py-3 rounded-xl border ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} focus:ring-2 outline-none transition-colors`}
                      />
                      {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium border-r border-gray-200 pr-3">+91</span>
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          placeholder="Enter 10 digit number"
                          value={bookingPhone}
                          onChange={(e) => { 
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) {
                              setBookingPhone(val);
                              setPhoneError('');
                            }
                          }}
                          className={`w-full pl-16 pr-4 py-3 rounded-xl border ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} focus:ring-2 outline-none transition-colors`}
                        />
                      </div>
                      {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600 font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-gray-900">₹{(pkg.price * travelers).toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-md"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                </>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
