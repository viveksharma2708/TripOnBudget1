import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase';

export type Booking = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageId: string;
  packageTitle: string;
  date: string;
  travelers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  isFakeName?: boolean;
};

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  updateBooking: (id: string, bookingData: Partial<Booking>) => Promise<void>;
  loading: boolean;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      let query = supabase.from('bookings').select('*');
      
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        setBookings(data.map(b => ({
          id: b.id,
          userId: b.user_id,
          userName: b.user_name,
          userEmail: b.user_email,
          packageId: b.package_id,
          packageTitle: b.package_title,
          date: b.date,
          travelers: b.travelers,
          totalAmount: b.total_amount,
          status: b.status as any,
          createdAt: b.created_at,
          isFakeName: b.is_fake_name
        })));
      }
      setLoading(false);
    };

    fetchBookings();

    // Setup real-time subscription
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const { error } = await supabase.from('bookings').insert([{
      user_id: user?.id,
      user_name: bookingData.userName,
      user_email: bookingData.userEmail,
      package_id: bookingData.packageId,
      package_title: bookingData.packageTitle,
      date: bookingData.date,
      travelers: bookingData.travelers,
      total_amount: bookingData.totalAmount,
      status: 'pending',
      is_fake_name: bookingData.isFakeName
    }]);

    if (error) {
      console.error('Error adding booking:', error.message);
      throw error;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking status:', error.message);
    }
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    const updatePayload: any = {};
    if (bookingData.userName) updatePayload.user_name = bookingData.userName;
    if (bookingData.userEmail) updatePayload.user_email = bookingData.userEmail;
    if (bookingData.date) updatePayload.date = bookingData.date;
    if (bookingData.travelers) updatePayload.travelers = bookingData.travelers;
    if (bookingData.totalAmount) updatePayload.total_amount = bookingData.totalAmount;
    if (bookingData.status) updatePayload.status = bookingData.status;

    const { error } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating booking:', error.message);
    }
  };

  return (
    <BookingContext.Provider value={{ 
        bookings, 
        addBooking, 
        updateBookingStatus, 
        updateBooking,
        loading
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings must be used within BookingProvider');
  return context;
};
