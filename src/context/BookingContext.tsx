import { createContext, useContext, useState, ReactNode } from 'react';

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
};

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  updateBooking: (id: string, bookingData: Partial<Booking>) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      status: 'confirmed', // Auto-confirm for now
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const updateBooking = (id: string, bookingData: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...bookingData } : b));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, updateBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings must be used within BookingProvider');
  return context;
};
