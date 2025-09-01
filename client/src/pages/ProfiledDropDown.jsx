import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import { ChevronDown, User, LogOut } from "lucide-react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const { user, url } = useAuth();

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
    <div ref={dropdownRef} className="!relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="!flex !items-center !gap-2 hover:!opacity-90 !transition-all !duration-300 !ease-in-out !cursor-pointer !outline-none"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <img
          src={
            user?.image ? `${url}${user.image}` : `/src/assets/demo_user.png`
          }
          alt="Profile"
          className="!rounded-full !h-9 !w-9 sm:!h-10 sm:!w-10 !object-cover !border-2 !shadow-md !transition-all !duration-300 !border-[var(--hover-color)] hover:!scale-105"
        />
        <ChevronDown
          className={`!w-4 !h-4 !text-gray-600 !transition-transform !duration-300 ${
            isOpen ? "!rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`!absolute !right-0 !z-50 !mt-2 !w-48 !bg-white !border !border-gray-200 !rounded-md !shadow-lg !overflow-hidden !transition-all !duration-300 !ease-in-out ${
          isOpen
            ? "!opacity-100 !scale-100 !translate-y-0"
            : "!opacity-0 !scale-95 !-translate-y-2 !pointer-events-none"
        }`}
      >
        {isOpen && (
          <ul className="!py-1">
            <li className="!px-2 !py-1.5">
              <Link
                to="/profile"
                className="!flex !items-center !gap-2 !w-full !px-3 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-100 !rounded-md !transition-colors !duration-200"
              >
                <User className="!w-4 !h-4 !text-gray-500" />
                <span>Profile</span>
              </Link>
            </li>
            <li className="!px-2 !py-1.5">
              <Link
                to="/logout"
                className="!flex !items-center !gap-2 !w-full !px-3 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-100 !rounded-md !transition-colors !duration-200"
              >
                <LogOut className="!w-4 !h-4 !text-gray-500" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
