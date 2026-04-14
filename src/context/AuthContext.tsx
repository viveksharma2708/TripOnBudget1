import { createContext, useContext, useState, ReactNode } from 'react';

export type User = { 
  id: string; 
  name: string; 
  email: string; 
  password?: string;
  role: 'admin' | 'user'; 
  joinDate: string;
};

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@triponbudget.com', password: 'password123', role: 'admin', joinDate: '2023-01-15' },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', role: 'user', joinDate: '2023-05-20' },
  { id: '3', name: 'Rahul Verma', email: 'rahul@example.com', password: 'password123', role: 'user', joinDate: '2023-08-10' },
  { id: '4', name: 'Anita Desai', email: 'anita@example.com', password: 'password123', role: 'user', joinDate: '2023-11-02' },
];

type AuthContextType = {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  signup: (email: string, name: string, password?: string) => boolean;
  logout: () => void;
  resetPassword: (email: string, newPassword?: string) => boolean;
  allUsers: User[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('allUsers');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const login = (email: string, password?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!existingUser) return false;
    
    // If password is provided, check it. If not (for backwards compatibility), just log in.
    if (password && existingUser.password && existingUser.password !== password) {
      return false;
    }
    
    setUser(existingUser);
    localStorage.setItem('currentUser', JSON.stringify(existingUser));
    return true;
  };

  const signup = (email: string, name: string, password?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) return false; // User already exists

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password,
      role: normalizedEmail.includes('admin') ? 'admin' : 'user',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const resetPassword = (email: string, newPassword?: string) => {
    const userIndex = allUsers.findIndex(u => u.email === email);
    if (userIndex === -1) return false; // User not found

    const updatedUsers = [...allUsers];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
