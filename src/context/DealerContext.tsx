import React, { createContext, useContext, useState, useEffect } from 'react';
import { DealerSettings } from '../types';
import { api } from '../lib/api';

interface DealerContextType {
  settings: DealerSettings | null;
  loading: boolean;
  isAdmin: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<DealerSettings>) => Promise<DealerSettings>;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
}

const DealerContext = createContext<DealerContextType | undefined>(undefined);

export const DealerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<DealerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    const valid = await api.verifyAuth();
    setIsAdmin(valid);
  };

  useEffect(() => {
    loadSettings();
    checkAuth();
  }, []);

  const refreshSettings = async () => {
    await loadSettings();
  };

  const updateSettings = async (updates: Partial<DealerSettings>) => {
    const updated = await api.updateSettings(updates);
    setSettings(updated);
    return updated;
  };

  const login = async (u: string, p: string) => {
    try {
      await api.login(u, p);
      setIsAdmin(true);
      return true;
    } catch {
      setIsAdmin(false);
      return false;
    }
  };

  const logout = () => {
    api.logout();
    setIsAdmin(false);
  };

  return (
    <DealerContext.Provider
      value={{
        settings,
        loading,
        isAdmin,
        refreshSettings,
        updateSettings,
        login,
        logout,
      }}
    >
      {children}
    </DealerContext.Provider>
  );
};

export function useDealer(): DealerContextType {
  const context = useContext(DealerContext);
  if (!context) {
    throw new Error('useDealer must be used within a DealerProvider');
  }
  return context;
}
