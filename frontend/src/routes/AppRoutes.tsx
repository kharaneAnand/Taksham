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
import About from "../pages/About/About";
import Offers from "../pages/offers/Offers";
import Consultation from "../pages/consultation/Consultation";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
import Checkout from "../pages/checkout/Checkout";
import Orders from "../pages/orders/Orders";
import OrderDetails from "../pages/orders/OrderDetails";
import Account from "../pages/account/Account";
import AdminProducts from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct" ;
import EditProduct from "../pages/admin/EditProduct" ;
import AdminCategories from "../pages/admin/Categories";
import AdminCollections from "../pages/admin/Collections";
import AddCollection from "../pages/admin/AddCollection";
import EditCollection from "../pages/admin/EditCollection";
import CollectionDetails from "../pages/collections/CollectionDetails";

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

           <Route
              path="/collections/:slug"
              element={<CollectionDetails />}
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

          {/* About */}

          <Route
            path="/about"
            element={<About />}
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
              path="/account"
              element={<Account />}
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

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />
            
            <Route
              path="/admin/products/new"
              element={<AddProduct />}
            />

            <Route
              path="/admin/products/:id/edit"
              element={<EditProduct />}
            />

            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />

            <Route
              path="/admin/collections"
              element={<AdminCollections />}
            />

            <Route
              path="/admin/collections/new"
              element={<AddCollection />}
            />

            <Route
              path="/admin/collections/:id/edit"
              element={<EditCollection />}
            />

           

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
};


export default AppRoutes;