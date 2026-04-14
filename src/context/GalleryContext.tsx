import { createContext, useContext, useState, ReactNode } from 'react';

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
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Omit<GalleryItem, 'id'>) => void;
  removeGalleryItem: (id: string) => void;
};

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const saveGallery = (newGallery: GalleryItem[]) => {
    setGalleryItems(newGallery);
    localStorage.setItem('gallery', JSON.stringify(newGallery));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    saveGallery([newItem, ...galleryItems]);
  };

  const updateGalleryItem = (id: string, updatedItem: Omit<GalleryItem, 'id'>) => {
    saveGallery(galleryItems.map(g => g.id === id ? { ...updatedItem, id } : g));
  };

  const removeGalleryItem = (id: string) => {
    saveGallery(galleryItems.filter(g => g.id !== id));
  };

  return (
    <GalleryContext.Provider value={{ galleryItems, addGalleryItem, updateGalleryItem, removeGalleryItem }}>
      {children}
    </GalleryContext.Provider>
  );
}

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) throw new Error('useGallery must be used within GalleryProvider');
  return context;
};
