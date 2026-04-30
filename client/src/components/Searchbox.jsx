import { CiSearch } from "react-icons/ci";

const Searchbox = () => {
  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
      <div className="flex items-center h-12 bg-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md focus-within:shadow-lg focus-within:ring-2 focus-within:ring-emerald-600">
        <input
          className="flex-1 h-full px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-800 bg-transparent outline-none border-none placeholder-gray-500 transition-all duration-200 focus:placeholder-transparent"
          type="text"
          placeholder="Search items..."
          aria-label="Search items"
        />
        <button
          className="min-w-0 h-full px-3 sm:px-4 bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800 transition-colors duration-200 rounded-none flex items-center justify-center"
          aria-label="Search button"
          title="Search"
        >
          <CiSearch className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 hover:scale-110" />
        </button>
      </div>
    </div>
  );
};

export default Searchbox;
