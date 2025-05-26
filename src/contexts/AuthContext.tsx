
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamMember } from '@/lib/types';
import { TEAM_MEMBERS } from '@/lib/constants';

interface AuthContextType {
  currentUser: TeamMember | null;
  login: (memberId: string, key: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as TeamMember;
        if (user && user.id && user.name) {
          setCurrentUser(user);
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((memberId: string, key: string): boolean => {
    const member = TEAM_MEMBERS.find(m => m.id === memberId);
    if (member && member.loginKey === key) {
      setCurrentUser(member);
      localStorage.setItem('currentUser', JSON.stringify(member));
      if (member.teamId === 'admin') {
        router.push('/dashboard'); // Admin también va al dashboard ahora
      } else {
        router.push('/dashboard');
      }
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    router.push('/');
  }, [router]);

  const contextValue = useMemo(() => ({
    currentUser,
    login,
    logout,
    isLoading
  }), [currentUser, login, logout, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
