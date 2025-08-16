import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AdminUser, BusinessPartner, AnalyticsData } from '../types/admin';
import { generateUniqueId } from '../lib/utils';

type AdminContextType = {
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[] | ((prev: AdminUser[]) => AdminUser[])) => void;
  loggedInAdmin: string | null;
  setLoggedInAdmin: (admin: string | null) => void;
  businessPartners: BusinessPartner[];
  setBusinessPartners: (partners: BusinessPartner[] | ((prev: BusinessPartner[]) => BusinessPartner[])) => void;
  analyticsData: AnalyticsData | null;
  setAnalyticsData: (data: AnalyticsData | null) => void;
  createAdminUser: (userData: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  createBusinessPartner: (partnerData: Omit<BusinessPartner, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBusinessPartner: (id: string, updates: Partial<BusinessPartner>) => void;
  deleteBusinessPartner: (id: string) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUsers, setAdminUsers] = useLocalStorage<AdminUser[]>('adminUsers', [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'admin',
      role: 'super_admin',
      permissions: [
        'users_management',
        'analytics_view',
        'business_management',
        'voucher_management',
        'system_settings',
        'reports_export',
        'admin_users_management'
      ],
      createdAt: new Date().toISOString(),
      isActive: true,
      createdBy: 'system'
    }
  ]);
  
  const [loggedInAdmin, setLoggedInAdmin] = useLocalStorage<string | null>('loggedInAdmin', null);
  const [businessPartners, setBusinessPartners] = useLocalStorage<BusinessPartner[]>('businessPartners', []);
  const [analyticsData, setAnalyticsData] = useLocalStorage<AnalyticsData | null>('analyticsData', null);

  const createAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: generateUniqueId(),
      createdAt: new Date().toISOString()
    };
    setAdminUsers(prev => [...prev, newUser]);
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    );
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers(prev => prev.filter(user => user.id !== id));
  };

  const createBusinessPartner = (partnerData: Omit<BusinessPartner, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPartner: BusinessPartner = {
      ...partnerData,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBusinessPartners(prev => [...prev, newPartner]);
  };

  const updateBusinessPartner = (id: string, updates: Partial<BusinessPartner>) => {
    setBusinessPartners(prev => 
      prev.map(partner => 
        partner.id === id 
          ? { ...partner, ...updates, updatedAt: new Date().toISOString() }
          : partner
      )
    );
  };

  const deleteBusinessPartner = (id: string) => {
    setBusinessPartners(prev => prev.filter(partner => partner.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      adminUsers,
      setAdminUsers,
      loggedInAdmin,
      setLoggedInAdmin,
      businessPartners,
      setBusinessPartners,
      analyticsData,
      setAnalyticsData,
      createAdminUser,
      updateAdminUser,
      deleteAdminUser,
      createBusinessPartner,
      updateBusinessPartner,
      deleteBusinessPartner
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}