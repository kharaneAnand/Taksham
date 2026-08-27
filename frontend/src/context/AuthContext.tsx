import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  LoginInput,
  User,
} from "../types/auth";

import AuthService from "../services/auth.service";


/*
 * ========================================
 * AUTH CONTEXT TYPE
 * ========================================
 */

interface AuthContextType {
  user: User | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (
    data: LoginInput,
  ) => Promise<User>;

  logout: () => Promise<void>;

  checkAuth: () => Promise<void>;

  setUser: (
    user: User | null,
  ) => void;
}


/*
 * ========================================
 * AUTH CONTEXT
 * ========================================
 */

const AuthContext =
  createContext<AuthContextType | null>(
    null,
  );


/*
 * ========================================
 * AUTH PROVIDER
 * ========================================
 */

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);


  /*
   * ========================================
   * LOGIN
   * ========================================
   */

  const login = async (
    data: LoginInput,
  ): Promise<User> => {
    const user =
      await AuthService.login(data);

    if (!user) {
      throw new Error(
        "Login failed. User data was not returned.",
      );
    }

    setUser(user);

    return user;
  };


  /*
   * ========================================
   * LOGOUT
   * ========================================
   */

  const logout =
    async (): Promise<void> => {
      try {
        await AuthService.logout();
      } finally {
        /*
         * Always clear frontend user state
         * even if the backend session has
         * already expired.
         */

        setUser(null);
      }
    };


  /*
   * ========================================
   * CHECK AUTHENTICATION
   * ========================================
   */

  const checkAuth =
    async (): Promise<void> => {
      try {
        const authenticatedUser =
          await AuthService.me();

        setUser(
          authenticatedUser,
        );
      } catch {
        /*
         * User is not authenticated.
         */

        setUser(null);
      } finally {
        setLoading(false);
      }
    };


  /*
   * ========================================
   * INITIAL AUTH CHECK
   * ========================================
   */

  useEffect(() => {
    void checkAuth();
  }, []);


  /*
   * ========================================
   * PROVIDER
   * ========================================
   */

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


/*
 * ========================================
 * USE AUTH HOOK
 * ========================================
 */

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};