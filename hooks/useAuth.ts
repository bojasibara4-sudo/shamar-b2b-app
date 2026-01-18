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
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Timeout de sécurité : après 1.5s, arrêter le loading même si la session n'est pas chargée
    timeoutId = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 1500);

    // Récupérer la session initiale avec gestion d'erreur
    supabaseClient.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error in getSession:', error);
        if (mounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      });

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        clearTimeout(timeoutId);
        loadUserProfile(session.user.id);
      } else {
        clearTimeout(timeoutId);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
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
      // Créer le profil utilisateur dans la table users (idempotent)
      const { error: profileError } = await supabaseClient
        .from('users')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email,
            role: 'buyer', // Rôle par défaut
          } as any,
          {
            onConflict: 'id',
            ignoreDuplicates: true,
          }
        );

      // Ne pas bloquer si le profil existe déjà (inscription multiple)
      if (profileError && !profileError.message?.includes('duplicate')) {
        throw profileError;
      }
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

