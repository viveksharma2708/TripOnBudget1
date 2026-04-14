import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  const [date, setDate] = useState('');
  const [bookingEmail, setBookingEmail] = useState(user?.email || '');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      handleBookNowClick();
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setBookingEmail(user.email);
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

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    
    if (user && bookingEmail !== user.email) {
      setBookingError('Booking email must match your logged-in account email.');
      return;
    }
    
    if (user && pkg) {
      addBooking({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        packageId: pkg.id,
        packageTitle: pkg.title,
        date,
        travelers,
        totalAmount: pkg.price * travelers
      });
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setIsBookingModalOpen(false);
      setBookingSuccess(false);
      navigate(`/packages/${id}`, { replace: true });
    }, 3000);
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
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
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
              {bookingSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for booking with TripOnBudget. We have sent the confirmation details to your email.
                  </p>
                  <button 
                    onClick={() => setIsBookingModalOpen(false)}
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                        <input 
                          type="date" 
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={travelers}
                          onChange={(e) => setTravelers(parseInt(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                      />
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
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
