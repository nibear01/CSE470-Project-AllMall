import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItem from "../../components/ProductItem/ProductItem";

const allProducts = [
  {
    id: 1,
    type: "Fashion",
    name: "Men Opaque Casual Shirt",
    image1:
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
    image2:
      "https://serviceapi.spicezgold.com/download/1742463096960_hbhb3.jpg",
    price: 500,
    oldPrice: 1650,
    rating: 4,
    stock: 5,
  },
  {
    id: 2,
    type: "Bags",
    name: "Large 33 L Laptop Backpack 33 L Waterproof 5-Zipper",
    image1:
      "https://serviceapi.spicezgold.com/download/1742447215241_blubags-waterproof-school-backpack-36-l-laptop-bag-college-backpack-school-bag-product-images-rvxyzquw2b-0-202312201359.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742447215242_blubags-waterproof-school-backpack-36-l-laptop-bag-college-backpack-school-bag-product-images-rvxyzquw2b-1-202312201359.webp",
    price: 1800,
    oldPrice: 2900,
    rating: 4,
    stock: 5,
  },
  {
    id: 3,
    type: "Electronics",
    name: "Apple iPhone 15 (Blue, 128 GB)",
    image1:
      "https://serviceapi.spicezgold.com/download/1742446875533_app3.jpeg",
    image2:
      "https://serviceapi.spicezgold.com/download/1742446875533_app2.jpeg",
    price: 135999,
    oldPrice: 145999,
    rating: 4,
    stock: 5,
  },
  {
    id: 4,
    type: "Fashion",
    name: "Embroidered Satin Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 5,
    type: "Fashion",
    name: "Embroidered Satin Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 12000,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 6,
    type: "Fashion",
    name: "Embroidered Satin Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 7,
    type: "Fashion",
    name: "Embroidered Satin Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1500,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 8,
    type: "Fashion",
    name: "Z Embroidered Satin Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 9,
    type: "Fashion",
    name: "Ambroidered Satin Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 300,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  // Add more dummy products as needed
];

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

  useEffect(() => {
    console.log("category from URL:", category);

    let filtered = allProducts.filter(
      (product) =>
        category &&
        product.type?.toLowerCase() === category.toLowerCase() &&
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filtered);

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
  }, [category, searchTerm, sortType]);

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
        <h1 className="!text-2xl !font-bold !mb-6 !capitalize">{category}</h1>

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
             <option value="priceLowToHigh" className="!rounded-lg">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAToZ">Name: A to Z</option>
              <option value="nameZToA">Name: Z to A</option>
          </select>

          {/* <ListBox/> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <p className="!text-gray-500">No products found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;      