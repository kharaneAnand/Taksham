import {createContext,useContext,useState,} from "react";
import type {ReactNode,} from "react";


interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  avatar: {
    url: string;
    publicId: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(false);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        setLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};