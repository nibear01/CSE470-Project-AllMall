/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
      // Check if the product has a category that matches the URL param
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
  }, [category, searchTerm, sortType, products]);

  return (
    <div className="flex !min-h-screen !bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[250px] !bg-white !shadow-md !px-4 !py-6">
        <h2 className="!text-xl !font-bold !mb-4 !pl-3">Shop by Category</h2>
        <ul className="!space-y-2">
          {categories.map((cat) => (
            <li key={cat} className="!capitalize">
              <Link
                to={`/category/${cat}`}
                className={`!block !cursor-pointer !py-1 !pl-3 rounded hover:!bg-gray-200 ${
                  cat === category
                    ? "!text-[var(--hover-color)] !font-semibold"
                    : ""
                }`}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 !p-6">
        <h1 className="!text-2xl !font-bold !mb-6 !capitalize">
          {category || "All products"}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-6 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!w-full h-10 sm:!w-[400px] !border !border-gray-300 !rounded-md !px-3 !py-2 focus:outline-0"
          />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="!border !border-gray-300 !rounded-md !px-3 !py-2 !w-full sm:!w-[200px] outline-0"
          >
            <option value="priceLowToHigh" className="!rounded-lg">
              Price: Low to High
            </option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="nameAToZ">Name: A to Z</option>
            <option value="nameZToA">Name: Z to A</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="!text-gray-500 text-lg">
                {isLoading ? "Loading products..." : "No products found."}
              </p>
              {!isLoading && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortType("priceLowToHigh");
                  }}
                  className="mt-4 px-4 py-2 bg-[var(--hover-color)] text-white rounded hover:bg-opacity-90"
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
