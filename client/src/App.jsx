import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer/Footer";
import Registration from "./components/LoginRegistration/Registration";
import LoginPage from "./components/LoginRegistration/Login";
import Logout from "./pages/Logout";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import Cart from "./pages/Cart";

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/cart-view" element={<Cart />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
