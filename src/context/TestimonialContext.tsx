import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { testimonials as initialTestimonials } from '../data/mockData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  orderBy,
  writeBatch,
  getDoc
} from 'firebase/firestore';

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
  clearAllTestimonials: () => Promise<void>;
};

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const path = 'testimonials';
    const testimonialsCol = collection(db, path);
    const q = query(testimonialsCol, orderBy('id', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if Firestore is empty AND user is admin
        if (user?.role === 'admin') {
          const seedStatusRef = doc(db, 'settings', 'testimonial_seed_status');
          const seedStatus = await getDoc(seedStatusRef);
          
          if (!seedStatus.exists() || !seedStatus.data().seeded) {
            const batch = writeBatch(db);
            initialTestimonials.forEach((t) => {
              const newDocRef = doc(testimonialsCol);
              batch.set(newDocRef, {
                ...t,
                id: newDocRef.id
              });
            });
            // Mark as seeded
            batch.set(seedStatusRef, { seeded: true, timestamp: new Date().toISOString() });
            await batch.commit();
          } else {
            // Already seeded once, so if it's empty, it means admin deleted everything. Don't re-seed.
            setTestimonials([]);
            setLoading(false);
          }
        } else {
          setTestimonials([]);
          setLoading(false);
        }
      } else {
        const testimonialsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Testimonial));
        setTestimonials(testimonialsList);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    const path = 'testimonials';
    try {
      await addDoc(collection(db, path), testimonial);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateTestimonial = async (id: string, updatedTestimonial: Omit<Testimonial, 'id'>) => {
    const path = `testimonials/${id}`;
    try {
      await updateDoc(doc(db, 'testimonials', id), updatedTestimonial);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const removeTestimonial = async (id: string) => {
    const path = `testimonials/${id}`;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const clearAllTestimonials = async () => {
    const path = 'testimonials';
    try {
      const batch = writeBatch(db);
      testimonials.forEach((t) => {
        batch.delete(doc(db, 'testimonials', t.id));
      });
      
      // Also update seed status so they don't come back
      const seedStatusRef = doc(db, 'settings', 'testimonial_seed_status');
      batch.set(seedStatusRef, { seeded: true, timestamp: new Date().toISOString() });
      
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, addTestimonial, updateTestimonial, removeTestimonial, clearAllTestimonials, loading }}>
      {children}
    </TestimonialContext.Provider>
  );
}

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error('useTestimonials must be used within TestimonialProvider');
  return context;
};
