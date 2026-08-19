import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import type {
  LoginInput,
  User,
} from "../types/auth";

import AuthService from "../services/auth.service";

interface AuthContextType {
  user: User | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (
    data: LoginInput
  ) => Promise<User>;

  logout: () => Promise<void>;

  checkAuth: () => Promise<void>;

  setUser: (user: User | null) => void;
}

const AuthContext =
  createContext<AuthContextType | null>(
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
    useState(true);

 

  const login = async (
    data: LoginInput
  ): Promise<User> => {
    const loggedInUser =
      await AuthService.login(data);

    setUser(loggedInUser);

    return loggedInUser;
  };



  const logout = async () => {
    await AuthService.logout();

    setUser(null);
  };

 

  const checkAuth = async () => {
    try {
      const authenticatedUser =
        await AuthService.me();

      setUser(authenticatedUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    checkAuth();
  }, []);

  

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        isAuthenticated:
          !!user,

        login,

        logout,

        checkAuth,

        setUser,
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