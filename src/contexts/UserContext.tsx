import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { UserAccount } from '../types';

type UserContextType = {
  userAccounts: UserAccount[];
  setUserAccounts: (accounts: UserAccount[] | ((prev: UserAccount[]) => UserAccount[])) => void;
  loggedInUser: string | null;
  setLoggedInUser: (user: string | null) => void;
  createUserAccount: (phone: string, giftCard: any) => void;
  updateUserAccount: (phone: string, updates: Partial<UserAccount>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userAccounts, setUserAccounts] = useLocalStorage<UserAccount[]>('userAccounts', []);
  const [loggedInUser, setLoggedInUser] = useLocalStorage<string | null>('loggedInUser', null);

  const createUserAccount = (phone: string, giftCard: any) => {
    const existingUserIndex = userAccounts.findIndex(user => user.phone === phone);
    
    if (existingUserIndex >= 0) {
      // Add gift card to existing user
      const updatedAccounts = [...userAccounts];
      updatedAccounts[existingUserIndex].giftCards.push(giftCard);
      setUserAccounts(updatedAccounts);
    } else {
      // Create new user account
      const newAccount: UserAccount = {
        id: Date.now().toString(), // or use a better unique id generator if available
        name: '', // or prompt for name, or set a default
        phone,
        password: phone, // Use phone number as password
        giftCards: [giftCard]
      };
      setUserAccounts(prev => [...prev, newAccount]);
    }
    
    // Debug log to verify account creation
    console.log('✅ User account created/updated:', { phone, password: phone });
  };

  const updateUserAccount = (phone: string, updates: Partial<UserAccount>) => {
    setUserAccounts(prev => 
      prev.map(account => 
        account.phone === phone 
          ? { ...account, ...updates }
          : account
      )
    );
  };

  return (
    <UserContext.Provider value={{
      userAccounts,
      setUserAccounts,
      loggedInUser,
      setLoggedInUser,
      createUserAccount,
      updateUserAccount
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}