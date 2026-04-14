import { createContext, useContext, useState, ReactNode } from 'react';

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
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => void;
  deleteInquiry: (id: string) => void;
};

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      subject: 'Bali Package Inquiry',
      message: 'I am interested in the Bali package for 2 people. Can you provide more details?',
      date: new Date().toISOString()
    }
  ]);

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'date'>) => {
    const newInquiry = {
      ...inquiry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setInquiries([newInquiry, ...inquiries]);
  };

  const deleteInquiry = (id: string) => {
    setInquiries(inquiries.filter(i => i.id !== id));
  };

  return (
    <InquiryContext.Provider value={{ inquiries, addInquiry, deleteInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (!context) throw new Error('useInquiries must be used within InquiryProvider');
  return context;
};
