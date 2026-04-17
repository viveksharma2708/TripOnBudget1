import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinDate: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password?: string) => Promise<{success: boolean; error?: string}>;
  signup: (email: string, name: string, password?: string) => Promise<{success: boolean; error?: string; requiresEmail?: boolean}>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  allUsers: User[];
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout - if Supabase takes longer than 3 seconds to respond, force UI to show
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth session error:", error.message);
        }
        if (session?.user && isMounted) {
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error("Critical error getting session:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(fallbackTimeout);
        }
      }
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          if (isMounted) setUser(null);
        }
      } catch (err) {
         console.error("Auth state change error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(fallbackTimeout);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, it's a new signup
        // Usually handled in signup, but fallback here
        const newProfile = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: (supabaseUser.email?.includes('admin') || supabaseUser.email === 'padatvivek2@gmail.com') ? 'admin' : 'user',
          join_date: new Date().toISOString()
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (!createError && createdProfile) {
          setUser({
            id: createdProfile.id,
            name: createdProfile.name,
            email: createdProfile.email,
            role: createdProfile.role as 'admin' | 'user',
            joinDate: createdProfile.join_date
          });
        } else {
          // Fallback just in case RLS blocked the insert - don't leave the UI dead
          console.error("Profile insert failed, falling back to local state:", createError);
          setUser({
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            role: newProfile.role as 'admin' | 'user',
            joinDate: newProfile.join_date
          });
        }
      } else if (!error && data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as 'admin' | 'user',
          joinDate: data.join_date
        });
      } else {
        // Fallback for ANY OTHER database error (e.g. table does not exist)
        console.error("Profile fetch completely failed, bypassing database lock:", error);
        setUser({
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: (supabaseUser.email?.includes('admin') || supabaseUser.email === 'padatvivek2@gmail.com') ? 'admin' : 'user',
          joinDate: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchUsers = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (!error && data) {
          setAllUsers(data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role as 'admin' | 'user',
            joinDate: u.join_date
          })));
        }
      };
      
      fetchUsers();
    }
  }, [user]);

  const login = async (email: string, password?: string): Promise<{success: boolean; error?: string}> => {
    try {
      if (!password) return { success: false, error: 'Password is required' };
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // We set a raw timer so it doesn't await a hung promise
        fetchProfile(data.user);
        
        // As a hard bypass, just force the return so the UI updates
        return { success: true };
      }
      return { success: false, error: 'Unknown login error' };
    } catch (err: any) {
      console.error('Fatal Login Exception:', err);
      // Supabase's network/CORS crashes are usually thrown instead of returned in error
      return { success: false, error: 'Cannot connect to Supabase. Please ensure your VITE_SUPABASE_ANON_KEY is correct in settings.' };
    }
  };

  const signup = async (email: string, name: string, password?: string): Promise<{success: boolean; error?: string; requiresEmail?: boolean}> => {
    try {
      if (!password) return { success: false, error: 'Password is required' };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Check if the user was just created or if they already exist but tried signing up again
        // Supabase responds with identites=[] if the user already exists and email confirmations are enabled
        if (data.user.identities && data.user.identities.length === 0) {
          return { success: false, error: 'User already registered' };
        }

        // If email confirmation is required, Supabase will not return a session on sign up
        const requiresConfirmation = !data.session;

        if (requiresConfirmation) {
          return { success: true, requiresEmail: true };
        }

        // If they got logged in immediately, create the profile
        const newProfile = {
          id: data.user.id,
          name,
          email,
          role: (email.includes('admin') || email === 'padatvivek2@gmail.com') ? 'admin' : 'user',
          join_date: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (profileError) {
          console.error('Profile creation error:', profileError.message);
        }
        
        fetchProfile(data.user);
        return { success: true, requiresEmail: false };
      }
      return { success: false, error: 'Unknown signup error' };
    } catch (err: any) {
      console.error('Fatal Signup Exception:', err);
      return { success: false, error: 'Cannot connect to Supabase. Check VITE_SUPABASE_ANON_KEY in settings.' };
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?view=update-password`,
    });
    
    if (error) {
      console.error('Reset password error:', error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, allUsers, loading }}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Connecting to Supabase...</p>
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
