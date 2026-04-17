import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';

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

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      if (data.length === 0) {
        // Seed initial data
        const seedData = initialGallery.map(({ id, ...rest }) => ({ ...rest }));
        const { data: seededData, error: seedError } = await supabase
          .from('gallery')
          .insert(seedData)
          .select();
        
        if (!seedError && seededData) {
          setGalleryItems(seededData as any);
        }
      } else {
        setGalleryItems(data as any);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const { error } = await supabase
      .from('gallery')
      .insert([item]);

    if (error) {
      console.error('Error adding gallery item:', error.message);
    } else {
      fetchGallery();
    }
  };

  const updateGalleryItem = async (id: string, updatedItem: Omit<GalleryItem, 'id'>) => {
    const { error } = await supabase
      .from('gallery')
      .update(updatedItem)
      .eq('id', id);

    if (error) {
      console.error('Error updating gallery item:', error.message);
    } else {
      fetchGallery();
    }
  };

  const removeGalleryItem = async (id: string) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing gallery item:', error.message);
    } else {
      fetchGallery();
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
