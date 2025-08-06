import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserData } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (phone: string, pass: string) => Promise<void>;
  signup: (phone: string, pass: string, name: string, surname: string, school: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user in session storage on initial load
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (phone: string, pass: string): Promise<void> => {
    // In a real app, you'd call an API. Here we use localStorage as a mock DB.
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData: UserData = users[phone];

    if (userData && userData.password === pass) {
      const user: User = { 
        phone,
        name: userData.name,
        surname: userData.surname,
        school: userData.school || 'No school selected', // Handle legacy users
      };
      setCurrentUser(user);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Invalid phone number or password'));
    }
  };

  const signup = async (phone: string, pass: string, name: string, surname: string, school: string): Promise<void> => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[phone]) {
      return Promise.reject(new Error('An account with this phone number already exists.'));
    }
    
    // WARNING: Storing plain text passwords for demo only.
    const newUser: UserData = { 
        password: pass, 
        name,
        surname,
        school,
        tags: [] 
    };
    users[phone] = newUser;
    localStorage.setItem('users', JSON.stringify(users));
    
    const user: User = { phone, name, surname, school };
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return Promise.resolve();
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    // Optional: clear learnerInfo from session storage on logout
    sessionStorage.removeItem('learnerInfo');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};