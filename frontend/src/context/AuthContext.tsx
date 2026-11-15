import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { supabase } from '../services/supabase';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  loginWithGoogle: (payload: {
    email: string;
    full_name?: string;
    avatar_url?: string;
    sub?: string;
    id_token?: string;
    flow: 'login' | 'signup';
  }) => Promise<User>;
  setSession: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (fullName?: string, avatarUrl?: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = localStorage.getItem('digitick_token');
      if (token) {
        try {
          const profile = await authApi.getMe();
          if (isMounted) setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid token', err);
          localStorage.removeItem('digitick_token');
          if (isMounted) setUser(null);
        }
      } else if (supabase) {
        // Attempt to restore session from Supabase OAuth
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.email) {
            const res = await authApi.googleAuth({
              email: session.user.email,
              flow: 'login',
              sub: session.user.id,
            });
            localStorage.setItem('digitick_token', res.access_token);
            if (isMounted) setUser(res.user);
          }
        } catch {
          // No active Supabase session
        }
      }

      if (isMounted) setLoading(false);
    };

    initializeAuth();

    // Supabase Auth State Change Listener
    let authListener: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('digitick_token');
          if (isMounted) setUser(null);
        }
      });
      authListener = data.subscription;
    }

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const setSession = (token: string, newUser: User) => {
    localStorage.setItem('digitick_token', token);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    try {
      // 1. Sync with Supabase Auth if client is configured
      if (supabase) {
        try {
          await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });
        } catch (sbErr) {
          console.warn('Supabase signInWithPassword fallback:', sbErr);
        }
      }

      // 2. Authenticate with Digitick backend
      const res = await authApi.login(email.trim().toLowerCase(), password);
      localStorage.setItem('digitick_token', res.access_token);
      setUser(res.user);
      success(`Welcome back, ${res.user.full_name || 'shopper'}!`);
    } catch (err: any) {
      error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    try {
      // 1. Register with Supabase Auth if client is configured
      if (supabase) {
        try {
          await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });
        } catch (sbErr) {
          console.warn('Supabase signUp fallback:', sbErr);
        }
      }

      // 2. Register with Digitick backend
      const res = await authApi.register(email.trim().toLowerCase(), password, fullName);
      localStorage.setItem('digitick_token', res.access_token);
      setUser(res.user);
      success('Account created! Your default shopping list is ready.');
    } catch (err: any) {
      error(err.message || 'Registration failed');
      throw err;
    }
  };

  const loginWithGoogle = async (payload: {
    email: string;
    full_name?: string;
    avatar_url?: string;
    sub?: string;
    id_token?: string;
    flow: 'login' | 'signup';
  }) => {
    try {
      const res = await authApi.googleAuth(payload);
      localStorage.setItem('digitick_token', res.access_token);
      setUser(res.user);
      if (payload.flow === 'signup') {
        success('Account created via Google! Your default shopping list is ready.');
      } else {
        success(`Welcome back, ${res.user.full_name || 'shopper'}!`);
      }
      return res.user;
    } catch (err: any) {
      error(err.message || 'Google authentication failed');
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem('digitick_token');
    setUser(null);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
    success('Logged out successfully');
  };

  const updateProfile = async (fullName?: string, avatarUrl?: string) => {
    try {
      const updated = await authApi.updateProfile(fullName, avatarUrl);
      setUser(updated);
      success('Profile updated');
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const updated = await authApi.uploadAvatar(file);
      setUser(updated);
      success('Profile picture updated successfully!');
      return updated;
    } catch (err: any) {
      error(err.message || 'Failed to upload profile picture');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        loginWithGoogle,
        setSession,
        logout,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

