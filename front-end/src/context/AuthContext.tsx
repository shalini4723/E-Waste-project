import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  activity: any; // Keep this property since it's required by your existing code
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      // In a real app, you would make an API call here
      // This is a simplified example
      const mockUsers = [
        { 
          id: 1, 
          email: 'user@example.com', 
          password: 'password123', 
          name: 'Regular User', 
          role: 'user',
          activity: [] // Add the activity property
        },
        { 
          id: 2, 
          email: 'admin@example.com', 
          password: 'admin123', 
          name: 'Admin User', 
          role: 'admin',
          activity: [] // Add the activity property
        }
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = user;
      
      setCurrentUser(userWithoutPassword);
      setIsAdmin(userWithoutPassword.role === 'admin');
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      // In a real app, you would make an API call here
      // This is a simplified example
      const newUser = {
        id: Date.now(), // Generate a unique ID
        name,
        email,
        role: 'user', // Default role
        activity: [] // Add the activity property
      };

      setCurrentUser(newUser);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};