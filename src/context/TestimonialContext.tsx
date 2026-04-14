import { createContext, useContext, useState, ReactNode } from 'react';
import { testimonials as initialTestimonials } from '../data/mockData';

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
};

type TestimonialContextType = {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Omit<Testimonial, 'id'>) => void;
  removeTestimonial: (id: string) => void;
};

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem('testimonials', JSON.stringify(newTestimonials));
  };

  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    const newTestimonial = {
      ...testimonial,
      id: `test-${Date.now()}`
    };
    saveTestimonials([...testimonials, newTestimonial]);
  };

  const updateTestimonial = (id: string, updatedTestimonial: Omit<Testimonial, 'id'>) => {
    saveTestimonials(testimonials.map(t => t.id === id ? { ...updatedTestimonial, id } : t));
  };

  const removeTestimonial = (id: string) => {
    saveTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, addTestimonial, updateTestimonial, removeTestimonial }}>
      {children}
    </TestimonialContext.Provider>
  );
}

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error('useTestimonials must be used within TestimonialProvider');
  return context;
};
