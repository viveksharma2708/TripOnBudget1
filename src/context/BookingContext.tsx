import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

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

    setLoading(true);
    const path = 'bookings';
    const bookingsCol = collection(db, path);
    let q = query(bookingsCol, orderBy('createdAt', 'desc'));

    if (user.role !== 'admin') {
      q = query(bookingsCol, where('userId', '==', user.id), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        } as Booking;
      });
      setBookings(bookingsList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const path = 'bookings';
    try {
      await addDoc(collection(db, path), {
        ...bookingData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    const path = `bookings/${id}`;
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    const path = `bookings/${id}`;
    try {
      const bookingRef = doc(db, 'bookings', id);
      const cleanData = { ...bookingData };
      delete (cleanData as any).id;
      delete (cleanData as any).createdAt;
      
      await updateDoc(bookingRef, cleanData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
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
