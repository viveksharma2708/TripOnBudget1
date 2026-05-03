import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
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
  userPhone: string;
  packageId: string;
  packageTitle: string;
  date: string;
  travelers: number;
  totalAmount: number;
  status: 'Waiting' | 'Confirmed' | 'Completed';
  paymentStatus: 'Pending' | 'Completed';
  createdAt: string;
  isFakeName?: boolean;
};

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  updateBooking: (id: string, bookingData: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
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
    // Remove orderBy to avoid composite index requirement for non-admins
    let q = query(bookingsCol);

    if (user.role !== 'admin') {
      q = query(bookingsCol, where('userId', '==', user.id));
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
      
      // Sort client-side to avoid index requirement
      const sortedList = [...bookingsList].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setBookings(sortedList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const path = 'bookings';
    try {
      await addDoc(collection(db, path), {
        ...bookingData,
        status: 'Waiting',
        paymentStatus: 'Pending',
        createdAt: serverTimestamp()
      });

      // Send confirmation email
      try {
        const response = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: bookingData.userEmail,
            name: bookingData.userName,
            packageTitle: bookingData.packageTitle,
            travelers: bookingData.travelers,
            totalAmount: bookingData.totalAmount,
            date: bookingData.date
          }),
        });
        
        const result = await response.json();
        console.log('Email send result:', result);
        
        if (!response.ok) {
          console.error('Email API failed with status:', response.status, result);
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // We don't want to fail the whole booking if email fails
      }
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

  const deleteBooking = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <BookingContext.Provider value={{ 
        bookings, 
        addBooking, 
        updateBookingStatus, 
        updateBooking,
        deleteBooking,
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
