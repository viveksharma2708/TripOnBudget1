import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { packages as initialPackages } from '../data/mockData';
import { supabase } from '../supabase';

export type Package = typeof initialPackages[0];

type PackageContextType = {
  packages: Package[];
  addPackage: (pkg: Omit<Package, 'id'>) => Promise<void>;
  updatePackage: (id: string, pkg: Omit<Package, 'id'>) => Promise<void>;
  removePackage: (id: string) => Promise<void>;
  loading: boolean;
};

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export function PackageProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      if (data.length === 0) {
        // Seed initial data
        const seedData = initialPackages.map(({ id, ...rest }) => ({
          title: rest.title,
          location: rest.location,
          duration: rest.duration,
          price: rest.price,
          originalPrice: rest.originalPrice,
          image: rest.image,
          category: rest.category,
          rating: rest.rating,
          reviews: rest.reviews,
          description: rest.description,
          itinerary: rest.itinerary,
          inclusions: rest.inclusions,
          exclusions: rest.exclusions,
          gallery: rest.gallery,
          video: rest.video
        }));
        
        const { data: seededData, error: seedError } = await supabase
          .from('packages')
          .insert(seedData)
          .select();
        
        if (!seedError && seededData) {
          setPackages(seededData as any);
        }
      } else {
        setPackages(data as any);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const addPackage = async (pkg: Omit<Package, 'id'>) => {
    const { error } = await supabase
      .from('packages')
      .insert([pkg]);

    if (error) {
      console.error('Error adding package:', error.message);
    } else {
      fetchPackages();
    }
  };

  const updatePackage = async (id: string, updatedPkg: Omit<Package, 'id'>) => {
    const { error } = await supabase
      .from('packages')
      .update(updatedPkg)
      .eq('id', id);

    if (error) {
      console.error('Error updating package:', error.message);
    } else {
      fetchPackages();
    }
  };

  const removePackage = async (id: string) => {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing package:', error.message);
    } else {
      fetchPackages();
    }
  };

  return (
    <PackageContext.Provider value={{ packages, addPackage, updatePackage, removePackage, loading }}>
      {children}
    </PackageContext.Provider>
  );
}

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) throw new Error('usePackages must be used within PackageProvider');
  return context;
};
