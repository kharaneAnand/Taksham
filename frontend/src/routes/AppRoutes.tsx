import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

import Home from "../pages/home/Home";

import Login from "../pages/login/Login";
import Register from "../pages/auth/Register";

import Profile from "../pages/profile/Profile";

import Dashboard from "../pages/admin/Dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

        </Route>

        {/* Guest Only */}

        <Route element={<PublicRoute />}>

          <Route element={<AuthLayout />}>

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

          </Route>

        </Route>

        {/* Protected */}

        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>

        </Route>

        {/* Admin */}

        <Route element={<AdminRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<Dashboard />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;