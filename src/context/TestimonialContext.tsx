import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { testimonials as initialTestimonials } from '../data/mockData';
import { supabase } from '../supabase';

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
};

type TestimonialContextType = {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
  loading: boolean;
};

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      if (data.length === 0) {
        // Seed initial data
        const seedData = initialTestimonials.map(({ id, ...rest }) => ({ ...rest }));
        const { data: seededData, error: seedError } = await supabase
          .from('testimonials')
          .insert(seedData)
          .select();
        
        if (!seedError && seededData) {
          setTestimonials(seededData as any);
        }
      } else {
        setTestimonials(data as any);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    const { error } = await supabase
      .from('testimonials')
      .insert([testimonial]);

    if (error) {
      console.error('Error adding testimonial:', error.message);
    } else {
      fetchTestimonials();
    }
  };

  const updateTestimonial = async (id: string, updatedTestimonial: Omit<Testimonial, 'id'>) => {
    const { error } = await supabase
      .from('testimonials')
      .update(updatedTestimonial)
      .eq('id', id);

    if (error) {
      console.error('Error updating testimonial:', error.message);
    } else {
      fetchTestimonials();
    }
  };

  const removeTestimonial = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing testimonial:', error.message);
    } else {
      fetchTestimonials();
    }
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, addTestimonial, updateTestimonial, removeTestimonial, loading }}>
      {children}
    </TestimonialContext.Provider>
  );
}

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error('useTestimonials must be used within TestimonialProvider');
  return context;
};
