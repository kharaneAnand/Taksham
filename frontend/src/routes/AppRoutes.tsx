import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

import ScrollToTop from "../components/common/ScrollToTop";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/profile/Profile";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/products/Products";
import ProductDetails from "../pages/products/ProductDetails";
import Rooms from "../pages/rooms/Rooms";
import RoomDetails from "../pages/rooms/RoomDetails";
import Collections from "../pages/collections/Collections";
import Ideas from "../pages/ideas/Ideas";
import InteriorServices from "../pages/interiorServices/InteriorServices";
import Projects from "../pages/projects/Projects";
import Offers from "../pages/offers/Offers";
import Consultation from "../pages/consultation/Consultation";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
import Checkout from "../pages/checkout/Checkout";
import Orders from "../pages/orders/Orders";
import OrderDetails from "../pages/orders/OrderDetails";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          {/* Products */}

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />

          {/* Rooms */}

          <Route
            path="/rooms"
            element={<Rooms />}
          />

          <Route
            path="/rooms/:id"
            element={<RoomDetails />}
          />

          {/* Collections */}

          <Route
            path="/collections"
            element={<Collections />}
          />

          {/* Ideas & Inspiration */}

          <Route
            path="/ideas"
            element={<Ideas />}
          />

          {/* Interior Services */}

          <Route
            path="/interior-services"
            element={<InteriorServices />}
          />

          {/* Projects */}

          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* Offers */}

          <Route
            path="/offers"
            element={<Offers />}
          />

          {/* Consultation */}

          <Route
            path="/consultation"
            element={<Consultation />}
          />

          {/* Cart */}

          <Route
            path="/cart"
            element={<Cart />}
          />

        </Route>


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



        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />

          </Route>

        </Route>


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