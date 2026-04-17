import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookingConfirmation() {
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  if (!bookingData) {
    return <Navigate to="/packages" replace />;
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden border border-gray-100"
      >
        <div className="bg-green-500 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-green-50">Thank you for choosing TripOnBudget</p>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-semibold text-gray-900">{bookingData.packageTitle}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-semibold text-gray-900">{bookingData.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travelers</p>
                  <p className="font-semibold text-gray-900">{bookingData.travelers} Person(s)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{bookingData.userName}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{bookingData.userEmail}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-8">
            <span className="text-lg text-gray-600 font-medium">Total Amount Paid</span>
            <span className="text-3xl font-bold text-gray-900">₹{bookingData.totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/dashboard"
              className="flex-1 bg-primary-600 text-white py-3.5 rounded-xl font-bold text-center hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              View My Bookings
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/"
              className="flex-1 bg-white text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
