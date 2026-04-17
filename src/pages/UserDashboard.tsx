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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Booking History</h2>
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
                          <span>Total: ₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span>Payment: <span className={booking.paymentStatus === 'Completed' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{booking.paymentStatus || 'Pending'}</span></span>
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
  );
}
