import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Store/Auth";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Registration from "./components/LoginRegistration/Registration";
import LoginPage from "./components/LoginRegistration/Login";
import Logout from "./pages/Logout";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ProductDisplay from "./components/ProductDisplay/ProductDisplay";

// Admin Panel Pages
import Dashboard from "./components/AdminPanel/Dashboard";
import Sidebar from "./components/AdminPanel/Sidebar";
import ProductManagement from "./components/AdminPanel/ProductManagement";
import OrderManagement from "./components/AdminPanel/OrderManagement";
import CustomerManagement from "./components/AdminPanel/CustomerManagement";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import ViewOrders from "./pages/ViewOrders";

function App() {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  //If admin
  if (isLoggedIn && user?.isAdmin) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="min-h-full">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/customers" element={<CustomerManagement />} />
              <Route path="/admin/logout" element={<Logout />} />
              {/* Prevent non-existent admin routes */}
              <Route
                path="*"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  //If customer or guest
  return (
    <>
      {!user?.isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
        {!isLoggedIn && <Route path="/register" element={<Registration />} />}
        {isLoggedIn && <Route path="/profile" element={<Profile />} />}
        {isLoggedIn && (
          <Route path="/profile/edit/:id" element={<EditProfile />} />
        )}
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route
          path="/cart-view"
          element={isLoggedIn ? <Cart /> : <Navigate to="/" replace />}
        />
        <Route
          path="/wishlist"
          element={isLoggedIn ? <Wishlist /> : <Navigate to="/" replace />}
        />
        <Route
          path="/my-orders"
          element={isLoggedIn ? <ViewOrders/> : <Navigate to="/" replace />}
        />
        <Route
          path="/checkout"
          element={isLoggedIn ? <Checkout /> : <Navigate to="/" replace />}
        />
        <Route path="/product/:id" element={<ProductDisplay />} />
        <Route path="/logout" element={<Logout />} />

        {/*Prevent access to admin routes for non-admins*/}
        <Route
          path="/admin/*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
