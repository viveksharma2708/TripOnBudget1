import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { packages as initialPackages } from '../data/mockData';
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
  writeBatch
} from 'firebase/firestore';

export type Package = {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  originalPrice: number;
  singlePrice?: number;
  groupPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  itinerary: { day: number; title: string; description: string; }[];
  inclusions: string[];
  exclusions: string[];
  gallery?: string[];
  video?: string;
  packageDate?: string;
};

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
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const path = 'packages';
    const packagesCol = collection(db, path);
    const q = query(packagesCol, orderBy('price', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const packagesList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Package));
      setPackages(packagesList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addPackage = async (pkg: Omit<Package, 'id'>) => {
    const path = 'packages';
    try {
      await addDoc(collection(db, path), pkg);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updatePackage = async (id: string, updatedPkg: Omit<Package, 'id'>) => {
    const path = `packages/${id}`;
    try {
      await updateDoc(doc(db, 'packages', id), updatedPkg);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const removePackage = async (id: string) => {
    const path = `packages/${id}`;
    try {
      await deleteDoc(doc(db, 'packages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
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
