import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
};

type InquiryContextType = {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  loading: boolean;
};

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      setInquiries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const path = 'inquiries';
    const inquiriesCol = collection(db, path);
    const q = query(inquiriesCol, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inquiriesList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date
        } as Inquiry;
      });
      setInquiries(inquiriesList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date'>) => {
    const path = 'inquiries';
    try {
      await addDoc(collection(db, path), {
        ...inquiry,
        date: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteInquiry = async (id: string) => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <InquiryContext.Provider value={{ inquiries, addInquiry, deleteInquiry, loading }}>
      {children}
    </InquiryContext.Provider>
  );
}

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (!context) throw new Error('useInquiries must be used within InquiryProvider');
  return context;
};
