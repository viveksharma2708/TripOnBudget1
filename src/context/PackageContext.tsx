import { createContext, useContext, useState, ReactNode } from 'react';
import { packages as initialPackages } from '../data/mockData';

export type Package = typeof initialPackages[0];

type PackageContextType = {
  packages: Package[];
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Omit<Package, 'id'>) => void;
  removePackage: (id: string) => void;
};

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export function PackageProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);

  const addPackage = (pkg: Omit<Package, 'id'>) => {
    const newPkg = { ...pkg, id: `pkg-${Date.now()}` };
    setPackages([newPkg, ...packages]);
  };

  const updatePackage = (id: string, updatedPkg: Omit<Package, 'id'>) => {
    setPackages(packages.map(p => p.id === id ? { ...updatedPkg, id } : p));
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  return (
    <PackageContext.Provider value={{ packages, addPackage, updatePackage, removePackage }}>
      {children}
    </PackageContext.Provider>
  );
}

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) throw new Error('usePackages must be used within PackageProvider');
  return context;
};
