'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  isBoosted: boolean;
  role: 'user' | 'mod' | 'admin' | 'owner';
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBoosted, setIsBoosted] = useState(false);
  const [role, setRole] = useState<'user' | 'mod' | 'admin' | 'owner'>('user');

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkBoostStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkBoostStatus(session.user.id);
        } else {
          setIsBoosted(false);
          setRole('user');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkBoostStatus = async (userId: string) => {
    console.log('SupabaseProvider - Fetching profile for userId:', userId);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_boosted, role')
      .eq('id', userId)
      .single();

    console.log('SupabaseProvider - Profile data:', data);
    console.log('SupabaseProvider - Profile error:', error);

    if (!error && data) {
      setIsBoosted(data.is_boosted);
      setRole(data.role || 'user');
      console.log('SupabaseProvider - Set role to:', data.role || 'user');
    } else {
      console.log('SupabaseProvider - No profile found, defaulting to user');
      setRole('user');
    }
  };

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error('Error signing in:', error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SupabaseContext.Provider value={{ user, loading, isBoosted, role, signInWithDiscord, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
