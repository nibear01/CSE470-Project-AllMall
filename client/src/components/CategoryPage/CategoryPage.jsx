import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItem from "../ProductItem/ProductItem";
import { useAuth } from "../../Store/Auth";

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
  const { products } = useAuth();

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = category
        ? product.category?.toLowerCase() === category.toLowerCase()
        : true;

      // Check if the product name matches the search term
      const matchesSearch = searchTerm
        ? product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });

    // Sorting
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
    <div className="flex !min-h-screen !bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-[280px] !bg-white !shadow-xl !px-6 !py-8 !mr-6 !sticky !top-0 !h-screen !overflow-y-auto">
        <h1 className="!text-2xl !font-bold !mb-6 !pl-3 text-gray-700">
          Categories
        </h1>
        <ul className="!space-y-3">
          {categories.map((cat) => (
            <li key={cat} className="!capitalize transition-all duration-300">
              <Link
                to={`/category/${cat}`}
                className={`!block !cursor-pointer !py-3 !pl-3 !rounded-xl transition-all duration-300 hover:!translate-x-2 hover:!bg-gradient-to-r hover:from-[var(--hover-color)]/10 hover:to-transparent ${
                  cat === category
                    ? "!text-white !font-semibold !bg-gradient-to-r !from-[var(--hover-color)] !to-[var(--hover-color)]/80 shadow-md"
                    : "text-gray-600 hover:!text-[var(--hover-color)]"
                }`}
              >
                <span className="flex items-center">{cat}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 !p-6">
        <div className="bg-white rounded-2xl !shadow-md !p-6 !mb-8">
          <h2 className="!text-2xl !font-bold !mb-2 !capitalize text-gray-700 flex items-center">
            {category || "All Products"}
            <span className="!ml-4 text-sm font-normal text-gray-500 bg-gray-100 !px-3 !py-1 rounded-full">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products" }
            </span>
          </h2>
          <p className="text-gray-500 text-[12px] !mb-6">
            Discover our amazing collection of {category || "products"}
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between !mb-2 !gap-4">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!w-full h-12 !border !border-gray-200 !rounded-xl !px-5 !py-3 focus:outline-0 focus:ring-2 focus:ring-[var(--hover-color)]/30 shadow-sm transition-all duration-300"
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

            <div className="flex items-center gap-3">
              <span className="text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="!border !border-gray-200 !rounded-xl !px-5 !py-3 !min-w-[200px] outline-0 focus:ring-2 focus:ring-[var(--hover-color)]/30 shadow-sm transition-all duration-300"
              >
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="nameAToZ">Name: A to Z</option>
                <option value="nameZToA">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="transform transition-all duration-300 hover:scale-95 hover:z-10"
              >
                <ProductItem product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center !py-16 bg-white rounded-2xl !shadow-md">
              <div className="!mx-auto !w-24 !h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="!h-12 !w-12 text-gray-400"
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
              <p className="!text-xl text-gray-600 !mb-2">
                {isLoading ? "Loading products..." : "No products found."}
              </p>
              <p className="!text-gray-500 !mb-6 !max-w-md !mx-auto">
                {isLoading
                  ? "Please wait while we load our amazing products"
                  : "Try adjusting your search or filter to find what you're looking for"}
              </p>
              {!isLoading && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortType("priceLowToHigh");
                  }}
                  className="!mt-4 !px-6 !py-3 bg-[var(--hover-color)] text-white rounded-xl hover:bg-opacity-90 shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
