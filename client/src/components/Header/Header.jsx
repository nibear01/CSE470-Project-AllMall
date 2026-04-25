import { Link, NavLink } from "react-router-dom";
import Searchbox from "../Searchbox";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Navigation from "/src/components/Header/Navigation/Navigation";
import { useAuth } from "../../Store/Auth";
import ProfileDropdown from "../../pages/ProfiledDropDown";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Package, Sparkles } from "lucide-react";
import "./Header.css";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
    fontSize: "10px",
    fontWeight: "bold",
  },
}));

const Header = () => {
  const { isLoggedIn, user, totalCartItem } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Modern Header Container */}
      <header
        className={`z-50 sticky top-0 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white shadow-md"
        }`}
      >
        {/* Premium Announcement Bar */}
        <div className="hidden lg:block bg-linear-to-r from-green-50 via-green-50 to-emerald-50 border-b border-green-100 px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              <p className="font-normal text-xs text-gray-700">
                Exciting Deals! Get up to 50% off new season styles
              </p>
            </div>
            <ul className="flex gap-6">
              <li>
                <NavLink
                  className="hover:text-green-600 text-gray-600 transition-colors duration-200 font-medium"
                  to="/help-center"
                >
                  Help Center
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:text-green-600 text-gray-600 transition-colors duration-200 font-medium"
                  to="/order-track"
                >
                  Track Order
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="border-b border-emerald-100">
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="max-w-7xl mx-auto">
              {/* Header Row 1: Mobile Menu, Logo, Actions */}
              <div className="flex items-center justify-between gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl hover:bg-emerald-50 transition-all duration-200 shrink-0 text-emerald-700 hover:text-emerald-600"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <FiX size={24} className="transition-transform" />
                  ) : (
                    <FiMenu size={24} className="transition-transform" />
                  )}
                </button>

                {/* Logo - Brand Identity */}
                <NavLink
                  to="/"
                  className="shrink-0 logo-container hover:opacity-90 transition-opacity duration-200"
                >
                  <img
                    className="h-10 sm:h-12 w-auto object-contain"
                    src="/logo_png.png"
                    alt="AllMall - Your Premium Shopping Destination"
                  />
                </NavLink>

                {/* Center: Search Box (Desktop) */}
                <div className="hidden lg:flex flex-1 mx-8">
                  <div className="w-full max-w-md">
                    <Searchbox />
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
                  {/* Desktop User Info */}
                  {isLoggedIn ? (
                    <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-emerald-100">
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-800">Welcome back,</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.username
                            ? user.username.split(" ")[0]
                            : "User"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-emerald-100">
                      <NavLink
                        className="text-sm font-medium text-gray-800 hover:text-emerald-600 transition-colors duration-200"
                        to="/login"
                      >
                        Login
                      </NavLink>
                      <span className="text-gray-300">•</span>
                      <NavLink
                        className="text-sm font-medium text-gray-800 hover:text-emerald-600 transition-colors duration-200"
                        to="/register"
                      >
                        Register
                      </NavLink>
                    </div>
                  )}

                  {/* Action Icons */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Mobile Search */}
                    <Link to="/search" className="lg:hidden">
                      <Tooltip title="Search">
                        <IconButton
                          aria-label="search"
                          size="small"
                          className="icon-btn"
                        >
                          <FiSearch className="w-5 h-5 text-emerald-700" />
                        </IconButton>
                      </Tooltip>
                    </Link>

                    {/* Orders - Desktop */}
                    {isLoggedIn && (
                      <Link to="/my-orders" className="hidden md:inline-block">
                        <Tooltip title="My Orders">
                          <IconButton
                            aria-label="orders"
                            size="small"
                            className="icon-btn"
                          >
                            <Package className="w-5 h-5 text-gray-800 hover:text-emerald-700" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart-view">
                      <Tooltip title="Shopping Cart">
                        <IconButton
                          aria-label="cart"
                          size="small"
                          className="icon-btn"
                        >
                          <StyledBadge
                            badgeContent={totalCartItem}
                            sx={{
                              "& .MuiBadge-badge": {
                                backgroundColor: "#10b981",
                                color: "white",
                                fontSize: "11px",
                                fontWeight: "bold",
                                padding: "2px 4px",
                              },
                            }}
                          >
                            <ShoppingCartIcon className="text-gray-700 hover:text-emerald-700 text-[22px] " />
                          </StyledBadge>
                        </IconButton>
                      </Tooltip>
                    </Link>

                    {/* Wishlist */}
                    <Link to="/wishlist">
                      <Tooltip title="Wishlist">
                        <IconButton
                          aria-label="wishlist"
                          size="small"
                          className="icon-btn"
                        >
                          <StyledBadge badgeContent={0} color="secondary">
                            <FaRegHeart className="text-gray-700 hover:text-emerald-700 text-[18px]" />
                          </StyledBadge>
                        </IconButton>
                      </Tooltip>
                    </Link>

                    {/* Profile Dropdown */}
                    {isLoggedIn && <ProfileDropdown />}
                  </div>
                </div>
              </div>

              {/* Header Row 2: Mobile Search */}
              <div className="lg:hidden mt-3">
                <Searchbox />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block border-t border-emerald-100 bg-white">
            <Navigation />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-emerald-100 animate-slideDown shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile User Section */}
              {isLoggedIn ? (
                <div className="pb-4 border-b border-emerald-100">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-emerald-600 mb-1">
                        Logged in as
                      </p>
                      <p className="text-sm font-semibold text-emerald-700">
                        {user?.username || "User"}
                      </p>
                    </div>
                    <ProfileDropdown />
                  </div>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-sm py-2 px-3 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-sm py-2 px-3 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </Link>
                </div>
              ) : (
                <div className="pb-4 border-b border-emerald-100 space-y-2">
                  <NavLink
                    className="block text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-sm py-2 px-3 rounded-lg font-medium"
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className="block text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-sm py-2 px-3 rounded-lg font-medium"
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </div>
              )}

              {/* Mobile Navigation */}
              <Navigation
                mobile={true}
                closeMenu={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
