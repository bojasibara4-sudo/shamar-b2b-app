'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  full_name?: string;
  company_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer la session initiale
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('id, email, role, full_name, company_name')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user && data.user.email) {
      // Créer le profil utilisateur dans la table users
      const { error: profileError } = await supabaseClient
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: 'buyer', // Rôle par défaut
        } as any);

      if (profileError) throw profileError;
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    router.push('/auth/login');
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}

