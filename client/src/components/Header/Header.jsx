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
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { Package } from "lucide-react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const { isLoggedIn, user, totalCartItem } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className=" !z-500 !bg-white !shadow-sm">
        {/* Top Announcement Bar */}
        <div className="!hidden md:!flex !items-center !justify-center !w-full !h-8 !bg-gray-100 !text-gray-700 !text-[10px] sm:!text-[11px]">
          <div className="!flex !justify-between !items-center !w-full !max-w-7xl !px-4">
            <p>Get up to 50% off new season styles, limited time only</p>
            <ul className="!flex !gap-4">
              <li>
                <NavLink
                  className="hover:!text-[var(--hover-color)] !transition-colors !duration-200"
                  to="/help-center"
                >
                  Help Center
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:!text-[var(--hover-color)] !transition-colors !duration-200"
                  to="/order-track"
                >
                  Order Tracking
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Header */}
        <div className="!border-b !border-gray-200 !bg-white">
          <div className="!flex !items-center !justify-between !px-4 !py-4 sm:!px-6 lg:!px-12 !max-w-7xl !mx-auto">
            {/* Mobile Menu Button */}
            <div className="md:!hidden !mr-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="!text-gray-700 hover:!text-[var(--hover-color)]"
              >
                <FiMenu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="!flex-shrink-0 !w-24 md:!w-32">
              <NavLink to="/">
                <img
                  className="!h-12 !w-auto"
                  src="/logo_png.png"
                  alt="AllMall"
                />
              </NavLink>
            </div>

            {/* Search Box - Hidden on mobile */}
            <div className="!hidden md:!block !flex-1 !mx-4 lg:!mx-8">
              <Searchbox />
            </div>

            {/* User Actions */}
            <div className="!flex !items-center !space-x-2 sm:!space-x-4">
              {isLoggedIn ? (
                <>
                  {/* View Orders Button - Desktop */}
                  <div className="!hidden sm:!flex !items-center !space-x-2">
                    <Link
                      className="!text-gray-700 hover:!text-[var(--hover-color)] !transition-colors !duration-200 !text-sm"
                      to="/profile"
                    >
                      {user?.username
                        ? `Welcome ${user.username.split(" ")[0]}`
                        : "Loading..."}
                    </Link>

                    {/* View Orders Button */}
                    <Link
                      to="/my-orders"
                      className="!hidden md:!flex !items-center !text-gray-700 hover:!text-[var(--hover-color)] !transition-colors !duration-200 !text-sm !ml-2"
                    >
                      <Package className="!w-4 !h-4 !mr-1" />
                      Orders
                    </Link>

                    <ProfileDropdown />
                  </div>

                  {/* View Orders Button - Mobile */}
                  <div className="md:!hidden">
                    <Link to="/my-orders">
                      <Tooltip title="My Orders">
                        <IconButton aria-label="orders">
                          <Package className="!w-5 !h-5 !text-gray-700" />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <NavLink
                    className="!hidden sm:!block !text-gray-700 hover:!text-[var(--hover-color)] !transition-colors !duration-200 !text-sm"
                    to="/login"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className="!hidden sm:!block !text-gray-700 hover:!text-[var(--hover-color)] !transition-colors !duration-200 !text-sm"
                    to="/register"
                  >
                    Register
                  </NavLink>
                </>
              )}

              {/* Mobile Search Button */}
              <div className="md:!hidden">
                <Link to="/search">
                  <Tooltip title="Search">
                    <IconButton aria-label="search">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="!h-5 !w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </IconButton>
                  </Tooltip>
                </Link>
              </div>

              {/* Cart */}
              <Link to="/cart-view">
                <Tooltip title="Cart">
                  <IconButton aria-label="cart">
                    <StyledBadge
                      badgeContent={totalCartItem}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#28a745", // custom green
                          color: "white",
                        },
                      }}
                    >
                      <ShoppingCartIcon className="!text-gray-700" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist">
                <Tooltip title="Wishlist">
                  <IconButton aria-label="wishlist">
                    <StyledBadge badgeContent={0} color="secondary">
                      <FaRegHeart className="!text-gray-700" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:!hidden !px-4 !pb-3">
            <Searchbox />
          </div>
        </div>

        {/* Navigation */}
        <div className="!hidden md:!block">
          <Navigation />
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:!hidden !bg-white !border-t !border-gray-200">
            <div className="!px-4 !py-2">
              {isLoggedIn ? (
                <div className="!space-y-3 !py-4 !border-b !border-gray-100">
                  <div className="!flex !items-center !justify-between">
                    <Link
                      className="!text-gray-700 hover:!text-[var(--hover-color)] !font-medium"
                      to="/profile"
                    >
                      {user?.username || "Loading..."}
                    </Link>
                    <ProfileDropdown />
                  </div>

                  {/* View Orders Link in Mobile Menu */}
                  <Link
                    to="/my-orders"
                    className="!flex !items-center !text-gray-700 hover:!text-[var(--hover-color)] !transition-colors !duration-200 !text-sm !mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="!w-4 !h-4 !mr-2" />
                    My Orders
                  </Link>
                </div>
              ) : (
                <div className="!flex !space-x-4 !py-2 !border-b !border-gray-100">
                  <NavLink
                    className="!text-gray-700 hover:!text-[var(--hover-color)]"
                    to="/login"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className="!text-gray-700 hover:!text-[var(--hover-color)]"
                    to="/register"
                  >
                    Register
                  </NavLink>
                </div>
              )}
              <Navigation mobile />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
