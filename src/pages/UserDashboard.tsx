import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Calendar, Users, CreditCard, Clock, MapPin } from 'lucide-react';

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, navigate, authLoading]);

  if (authLoading || bookingsLoading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const userBookings = bookings; // Context already filters for typical users if not admin

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4 border-4 border-white shadow-lg">
              <Users className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            <div className="w-full pt-6 border-t border-gray-50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Account Type</span>
                <span className="text-primary-600 font-bold uppercase tracking-wider text-[10px] bg-primary-50 px-2 py-1 rounded-md">{user.role || 'Traveler'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Member Since</span>
                <span className="text-gray-900 font-bold">{user.joinDate || '2026'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/packages" className="text-primary-600 text-sm font-bold hover:underline">New Adventure</Link>
            </div>
            
            <div className="p-6">
              {userBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You have no previous bookings.</p>
                  <Link to="/packages" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors inline-block">
                    Explore Packages
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userBookings.map(booking => (
                    <div key={booking.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-100 hover:border-primary-100 transition-colors bg-gray-50/50">
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{booking.packageTitle}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Clock className="w-4 h-4" /> Booked on {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Waiting' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Travel Date: {booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{booking.travelers} Traveler(s)</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>Total: ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>Payment: <span className={booking.paymentStatus === 'Completed' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{booking.paymentStatus || 'Pending'}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-bold text-gray-900">+91 {booking.userPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
