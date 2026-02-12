'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { UserRole } from '@/lib/permissions';

interface RoleContextType {
  availableRoles: UserRole[];
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole) => void;
  canSwitchRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children, userRole }: { children: ReactNode; userRole: UserRole }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole | null>(userRole);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([userRole]);

  useEffect(() => {
    // Récupérer les rôles disponibles de l'utilisateur
    const loadUserRoles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: userData } = await (supabase as any)
          .from('users')
          .select('role, roles')
          .eq('id', user.id)
          .single();

        if (userData) {
          // Si l'utilisateur a un champ roles (array), l'utiliser
          // Sinon, utiliser le rôle unique
          if (userData.roles && Array.isArray(userData.roles)) {
            setAvailableRoles(userData.roles);
          } else if (userData.role) {
            // Pour la compatibilité : si un utilisateur a 'seller', il peut aussi être 'buyer'
            const roles: UserRole[] = [userData.role];
            if (userData.role === 'seller') {
              roles.push('buyer');
            }
            setAvailableRoles(roles);
          }
        }
      } catch (error) {
        console.error('Error loading user roles:', error);
      }
    };

    loadUserRoles();
    setCurrentRoleState(userRole);
  }, [userRole]);

  const setCurrentRole = (role: UserRole) => {
    if (availableRoles.includes(role)) {
      setCurrentRoleState(role);
      // Sauvegarder dans localStorage pour persister
      localStorage.setItem('currentRole', role);
    }
  };

  // Récupérer le rôle depuis localStorage au chargement
  useEffect(() => {
    const savedRole = localStorage.getItem('currentRole') as UserRole | null;
    if (savedRole && availableRoles.includes(savedRole)) {
      setCurrentRoleState(savedRole);
    }
  }, [availableRoles]);

  const canSwitchRole = availableRoles.length > 1 && availableRoles.includes('buyer') && availableRoles.includes('seller');

  return (
    <RoleContext.Provider value={{
      availableRoles,
      currentRole,
      setCurrentRole,
      canSwitchRole,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
