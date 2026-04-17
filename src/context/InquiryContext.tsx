import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase';

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

  const fetchInquiries = async () => {
    if (user?.role !== 'admin') {
      setInquiries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setInquiries(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, [user]);

  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date'>) => {
    const { error } = await supabase
      .from('inquiries')
      .insert([inquiry]);

    if (error) {
      console.error('Error adding inquiry:', error.message);
      throw error;
    }
  };

  const deleteInquiry = async (id: string) => {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inquiry:', error.message);
    } else {
      fetchInquiries();
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
