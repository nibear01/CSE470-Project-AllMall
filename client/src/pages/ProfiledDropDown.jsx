import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
      >
        <img
          src="/src/assets/demo_user.png"
          alt="Profile"
          className="rounded-full h-10 w-10 border-2 border-[var(--hover-color)]"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute right-0 h-auto z-50 mt-2 w-35 bg-white border border-gray-200 rounded-[4px] shadow-lg p-2 text-sm">
          <li className="flex justify-center items-center font-[500] h-10 hover:bg-gray-100 rounded transition-all">
            <Link to="/profile" className="w-full text-center text-gray-700">
              Profile
            </Link>
          </li>
          <li className="flex justify-center items-center font-[500] h-10 hover:bg-gray-100 rounded transition-all">
            <Link to="/logout" className="w-full text-center text-gray-700">
              Logout
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
