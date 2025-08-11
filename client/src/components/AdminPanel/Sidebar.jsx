/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Package, Users, Home, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/admin/products",
    },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      path: "/admin/customers",
    },
    { id: "logout", label: "Logout", icon: LogOut, path: "/admin/logout" },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`fixed z-50 top-4 left-4 !p-2 rounded-lg bg-[var(--hover-color)] text-white md:hidden transition-all duration-300 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 !z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`h-full bg-white shadow-lg border-r border-gray-200 fixed md:relative z-50 w-64 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="!p-6 border-b border-gray-200">
          <div className="w-40">
            <img
              className="h-14 w-full"
              src="/src/assets/logo_png.png"
              alt="AllMall"
            />
          </div>

          <p className="text-lg !ml-4 font-bold text-gray-800">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="!mt-6">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={id}
                to={path}
                className={`flex items-center w-full !px-6 !py-3 text-left transition-colors ${
                  isActive
                    ? "bg-gray-100 font-semibold text-[var(--hover-color)] border-r-4 border-[var(--hover-color)]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 !mr-3" />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute !bottom-0 w-full !p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} AllMall Admin
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;