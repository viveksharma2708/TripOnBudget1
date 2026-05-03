import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export type GalleryItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
};

const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000',
    title: 'Taj Mahal at Sunrise'
  },
  {
    id: 'gal-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581793746485-04698e79a4e8?auto=format&fit=crop&q=80&w=1000',
    title: 'Pangong Lake, Ladakh'
  },
  {
    id: 'gal-3',
    type: 'video',
    url: 'https://www.youtube.com/embed/35npVaFGHMY',
    title: 'Incredible India Travel Video'
  },
  {
    id: 'gal-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
    title: 'Goa Beaches'
  }
];

type GalleryContextType = {
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Omit<GalleryItem, 'id'>) => Promise<void>;
  removeGalleryItem: (id: string) => Promise<void>;
  loading: boolean;
};

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const path = 'gallery';
    const galleryCol = collection(db, path);
    const q = query(galleryCol, orderBy('title', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if Firestore is empty AND user is admin
        if (user?.role === 'admin') {
            const seedStatusRef = doc(db, 'settings', 'gallery_seed_status');
            const seedStatus = await getDoc(seedStatusRef);
            
            if (!seedStatus.exists() || !seedStatus.data().seeded) {
                const batch = writeBatch(db);
                initialGallery.forEach((item) => {
                    const newDocRef = doc(galleryCol);
                    batch.set(newDocRef, {
                        ...item,
                        id: newDocRef.id
                    });
                });
                // Mark as seeded
                batch.set(seedStatusRef, { seeded: true, timestamp: new Date().toISOString() });
                await batch.commit();
            } else {
                // Already seeded once, so if it's empty, it means admin deleted everything.
                setGalleryItems([]);
                setLoading(false);
            }
        } else {
            setGalleryItems([]);
            setLoading(false);
        }
      } else {
        const galleryList = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        } as GalleryItem));
        setGalleryItems(galleryList);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const path = 'gallery';
    try {
        await addDoc(collection(db, path), item);
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateGalleryItem = async (id: string, updatedItem: Omit<GalleryItem, 'id'>) => {
    const path = `gallery/${id}`;
    try {
        await updateDoc(doc(db, 'gallery', id), updatedItem);
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const removeGalleryItem = async (id: string) => {
    const path = `gallery/${id}`;
    try {
        await deleteDoc(doc(db, 'gallery', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <GalleryContext.Provider value={{ galleryItems, addGalleryItem, updateGalleryItem, removeGalleryItem, loading }}>
      {children}
    </GalleryContext.Provider>
  );
}

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) throw new Error('useGallery must be used within GalleryProvider');
  return context;
};
