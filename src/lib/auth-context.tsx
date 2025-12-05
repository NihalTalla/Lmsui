import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, users } from './data';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: 'admin' | 'faculty' | 'student') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('codify_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determine role from email
    let role: 'admin' | 'faculty' | 'student' | null = null;
    
    if (email.includes('admin')) {
      role = 'admin';
    } else if (email.includes('faculty') || email.includes('trainer')) {
      role = 'faculty';
    } else if (email.includes('student')) {
      role = 'student';
    }
    
    // Find user by role or email
    const user = users.find(u => u.email === email || u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('codify_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codify_user');
  };

  const setRole = (role: 'admin' | 'faculty' | 'student') => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('codify_user', JSON.stringify(user));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}