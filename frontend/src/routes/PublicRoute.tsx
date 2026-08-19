import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;