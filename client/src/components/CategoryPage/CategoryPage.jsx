import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItem from "../ProductItem/ProductItem";
import { useAuth } from "../../Store/Auth";
import { FiX, FiFilter } from "react-icons/fi";

const categories = [
  "fashion",
  "electronics",
  "bags",
  "footwear",
  "groceries",
  "beauty",
  "wellness",
  "jewellery",
];

const CategoryPage = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("priceLowToHigh");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const { products } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = category
        ? product.category?.toLowerCase() === category.toLowerCase()
        : true;

      const matchesSearch = searchTerm
        ? product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });

    if (sortType === "priceLowToHigh") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "priceHighToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortType === "nameAToZ") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "nameZToA") {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(filtered);
    setIsLoading(false);
  }, [category, searchTerm, sortType, products]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="mx-auto w-full max-w-360 px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-5 lg:gap-8 items-start">
          {/* Sidebar */}
          <aside
            className={`bg-white border border-emerald-100 shadow-sm rounded-2xl px-4 sm:px-6 py-6 sm:py-8 transition-all duration-300 ${
              isMobile
                ? sidebarOpen
                  ? "fixed left-3 right-3 top-20 z-40 max-h-[80vh] overflow-y-auto"
                  : "hidden"
                : "sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto"
            }`}
          >
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Categories
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                aria-label="Close categories"
              >
                <FiX size={22} className="text-gray-800" />
              </button>
            </div>

            <h1 className="hidden lg:block text-2xl font-bold mb-6 pl-3 text-gray-800">
              Categories
            </h1>

            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="capitalize transition-all duration-300"
                >
                  <Link
                    to={`/category/${cat}`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={`block cursor-pointer py-2.5 pl-4 pr-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:bg-emerald-50 ${
                      cat === category
                        ? "text-white font-semibold bg-emerald-600 shadow-sm translate-x-1"
                        : "text-gray-700 hover:text-emerald-700"
                    }`}
                  >
                    <span className="flex items-center text-sm sm:text-base">
                      {cat}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="w-full">
            <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
              {/* Header with Filter Button */}
              <div className="flex items-start sm:items-center justify-between mb-5 sm:mb-6 gap-3">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 capitalize text-gray-800 flex items-center gap-2 sm:gap-3">
                    {category || "All Products"}
                    <span className="text-xs sm:text-sm font-normal text-gray-600 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full">
                      {filteredProducts.length}
                    </span>
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Discover our amazing collection of {category || "products"}
                  </p>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2.5 sm:p-3 rounded-lg hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2 bg-white border border-emerald-100 text-gray-800"
                    aria-label="Open category filters"
                  >
                    <FiFilter size={20} />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                )}
              </div>

              {/* Search and Sort */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 sm:h-12 border border-emerald-100 rounded-xl px-4 py-3 focus:outline-0 focus:ring-2 focus:ring-emerald-200 shadow-sm transition-all duration-300 text-sm"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 md:justify-end">
                  <label className="text-gray-600 text-sm font-medium whitespace-nowrap">
                    Sort:
                  </label>
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border border-emerald-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-0 focus:ring-2 focus:ring-emerald-200 shadow-sm transition-all duration-300 text-sm w-full sm:w-auto bg-white"
                  >
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="nameAToZ">Name: A to Z</option>
                    <option value="nameZToA">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="transform transition-all duration-300 hover:scale-[0.98]"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <ProductItem product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 sm:py-16 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                  <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-12 sm:w-12 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl text-gray-700 mb-2">
                    {isLoading ? "Loading products..." : "No products found."}
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {isLoading
                      ? "Please wait while we load our products"
                      : "Try adjusting your search or filter to find what you're looking for"}
                  </p>
                  {!isLoading && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSortType("priceLowToHigh");
                      }}
                      className="mt-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm transition-all duration-300"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
