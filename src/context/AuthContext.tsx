import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { googleProvider } from '../firebase';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinDate: string;
  emailVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password?: string) => Promise<{success: boolean; error?: string}>;
  signup: (email: string, name: string, password?: string) => Promise<{success: boolean; error?: string; requiresEmail?: boolean}>;
  loginWithGoogle: () => Promise<{success: boolean; error?: string}>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  deleteUserProfile: (id: string) => Promise<void>;
  allUsers: User[];
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (firebaseUser: FirebaseUser) => {
    const path = `users/${firebaseUser.uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: data.role as 'admin' | 'user',
          joinDate: data.joinDate || new Date().toISOString(),
          emailVerified: firebaseUser.emailVerified
        });
      } else {
        console.warn('Profile doc missing. Re-creating.');
        const emailStr = firebaseUser.email || '';
        const roleStr = (emailStr === 'padatvivek2@gmail.com' || emailStr === 'vivek5656sharma@gmail.com') ? 'admin' : 'user';
        const newUserObj: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || emailStr.split('@')[0] || 'User',
          email: emailStr,
          role: roleStr,
          joinDate: new Date().toISOString(),
          emailVerified: firebaseUser.emailVerified
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUserObj);
        setUser(newUserObj);
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission')) {
        handleFirestoreError(e, OperationType.GET, path);
      }
      console.error('Error fetching profile:', e);
      // Fallback
      setUser({
         id: firebaseUser.uid,
         name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
         email: firebaseUser.email || '',
         role: (firebaseUser.email === 'padatvivek2@gmail.com' || firebaseUser.email === 'vivek5656sharma@gmail.com') ? 'admin' : 'user',
         joinDate: new Date().toISOString(),
         emailVerified: firebaseUser.emailVerified
      });
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchUsers = async () => {
        const path = 'users';
        try {
          const snapshot = await getDocs(collection(db, path));
          const usersList = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              role: data.role,
              joinDate: data.joinDate,
              emailVerified: data.emailVerified !== undefined ? data.emailVerified : true
            } as User;
          });
          setAllUsers(usersList);
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, path);
        }
      };
      
      fetchUsers();
    }
  }, [user]);

  const loginWithGoogle = async (): Promise<{success: boolean; error?: string}> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.emailVerified) {
        await result.user.delete();
        return { success: false, error: 'Your Google email is not verified. Access denied.' };
      }
      await fetchProfile(result.user);
      return { success: true };
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      return { success: false, error: err.message || 'Failed to sign in with Google' };
    }
  };

  const login = async (email: string, password?: string): Promise<{success: boolean; error?: string}> => {
    if (!password) return { success: false, error: 'Password is required' };
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await logout();
        return { success: false, error: 'Please verify your email address before logging in. A verification link was sent to your inbox when you signed up.' };
      }
      await fetchProfile(userCredential.user);
      return { success: true };
    } catch (err: any) {
      let errorMsg = 'Invalid email or password. Please try again or create an account.';
      
      if (err.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password. If you haven\'t created an account yet, please sign up.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please try again later.';
      } else {
        console.error('Firebase login error:', err);
      }
      
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (email: string, name: string, password?: string): Promise<{success: boolean; error?: string; requiresEmail?: boolean}> => {
    if (!password) return { success: false, error: 'Password is required' };
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const roleStr = (email === 'padatvivek2@gmail.com' || email === 'vivek5656sharma@gmail.com') ? 'admin' : 'user';
      const newUserObj: User = {
        id: userCredential.user.uid,
        name: name,
        email: email,
        role: roleStr,
        joinDate: new Date().toISOString(),
        emailVerified: userCredential.user.emailVerified
      };
      
      // Save profile in Firestore
      const path = `users/${userCredential.user.uid}`;
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserObj);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      await logout(); // Logout to force them to verify before login
      
      return { success: true, requiresEmail: true };
    } catch (err: any) {
      console.error('Firebase signup error:', err);
      let errorMsg = err.message;
      if (err.code === 'auth/email-already-in-use') errorMsg = 'Email is already registered';
      return { success: false, error: errorMsg };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (e) {
      console.error("Password reset error:", e);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const deleteUserProfile = async (id: string) => {
    const path = `users/${id}`;
    if (id === user?.id) {
       console.warn("Admin Cannot delete themselves from the dashboard");
       return;
    }
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'users', id));
      setAllUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, resetPassword, deleteUserProfile, allUsers, loading }}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Connecting to Firebase...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

