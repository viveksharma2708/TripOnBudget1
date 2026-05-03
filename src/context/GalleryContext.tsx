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

const initialGallery: GalleryItem[] = [];

type GalleryContextType = {
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Omit<GalleryItem, 'id'>) => Promise<void>;
  removeGalleryItem: (id: string) => Promise<void>;
  clearAllGallery: () => Promise<void>;
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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const galleryList = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
      } as GalleryItem));
      setGalleryItems(galleryList);
      setLoading(false);
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

  const clearAllGallery = async () => {
    const path = 'gallery';
    try {
      const batch = writeBatch(db);
      galleryItems.forEach(item => {
        batch.delete(doc(db, 'gallery', item.id));
      });
      const seedStatusRef = doc(db, 'settings', 'gallery_seed_status');
      batch.set(seedStatusRef, { seeded: true, timestamp: new Date().toISOString() });
      
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <GalleryContext.Provider value={{ galleryItems, addGalleryItem, updateGalleryItem, removeGalleryItem, clearAllGallery, loading }}>
      {children}
    </GalleryContext.Provider>
  );
}

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) throw new Error('useGallery must be used within GalleryProvider');
  return context;
};
