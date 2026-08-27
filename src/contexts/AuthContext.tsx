import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  uid: string;
  email: string | null;
  displayName?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAs: (email: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInAs: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check for existing session
    const storedUser = localStorage.getItem('trinetra_mock_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const signInAs = (email: string) => {
    // Generate a consistent pseudo-random UID for the email for mock testing
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const mockUid = 'mock_' + Math.abs(hash).toString(16);

    const newUser = { uid: mockUid, email };
    setUser(newUser);
    localStorage.setItem('trinetra_mock_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('trinetra_mock_user');
    localStorage.removeItem('trinetra_role');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInAs, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
