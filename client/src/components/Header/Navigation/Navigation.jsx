import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ mobile, closeMenu }) => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Fashion", path: "/category/fashion" },
    { name: "Electronics", path: "/category/electronics" },
    { name: "Bags", path: "/category/bags" },
    { name: "Footwear", path: "/category/footwear" },
    { name: "Groceries", path: "/category/groceries" },
    { name: "Beauty", path: "/category/beauty" },
    { name: "Wellness", path: "/category/wellness" },
    { name: "Jewellery", path: "/category/jewellery" },
  ];

  if (mobile) {
    return (
      <nav className="mobile-nav space-y-1">
        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => closeMenu && closeMenu()}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-white text-gray-800"
                    : "text-gray-800 hover:bg-white hover:text-gray-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-t border-emerald-100 desktop-nav">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            {/* Navigation Links */}
            <ul className="flex items-center gap-2 flex-wrap justify-center">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium relative group ${
                        isActive
                          ? "text-gray-800 font-bold"
                          : "text-gray-800 hover:text-gray-800"
                      }`
                    }
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 rounded-full transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
