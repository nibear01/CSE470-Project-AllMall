/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Store/Auth";

const Wishlist = () => {
  const { url } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlistItems(response.data.wishlist?.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
      console.error("Error fetching wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove item from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`${url}/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Item removed from wishlist");
      setWishlistItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
      console.error("Error removing item:", err);
    }
  };

  // Add item to cart from wishlist
  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        `${url}/api/cart`,
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Show success toast notification
      toast.success("✅ Item added to cart successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.error("Error adding to cart:", err);

      // Show error toast notification
      toast.error(
        err.response?.data?.message || "❌ Failed to add item to cart",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="!flex !items-center !justify-center !min-h-[60vh]"
      >
        <div className="!text-center">
          <div className="!inline-block !w-12 !h-12 !border-4 !border-t-[var(--hover-color)] !border-gray-200 !rounded-full !animate-spin"></div>
          <p className="!mt-4 !text-gray-600 !text-lg">
            Loading your wishlist...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center flex-col !py-12 min-h-[60vh] "
      >
        <div className="!text-red-500 !text-lg !mb-4">{error}</div>
        <button
          onClick={fetchWishlist}
          className=" !px-6 !py-2 !bg-[var(--hover-color)] border !text-white !rounded-lg hover:!bg-white hover:!text-emerald-500 hover:!border-emerald-500 !transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="!min-h-screen !bg-gray-50 !py-8 !px-4 sm:!px-6 lg:!px-8"
    >
      <div className="!max-w-7xl !mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="!text-center !mb-12"
        >
          <h1 className="!text-3xl md:!text-4xl !font-bold !text-gray-900 !mb-4">
            Your Wishlist
          </h1>
          <p className="!text-gray-600 !text-lg">
            {wishlistItems.length === 0
              ? "Your wishlist is empty. Start adding items you love!"
              : `You have ${wishlistItems.length} item${
                  wishlistItems.length !== 1 ? "s" : ""
                } in your wishlist`}
          </p>
        </motion.div>

        {/* Wishlist Items */}
        <AnimatePresence mode="popLayout">
          {wishlistItems.length === 0 ? (
            <motion.div
              key="empty-wishlist"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="!text-center !py-16 !bg-white !rounded-xl !shadow-sm"
            >
              <div className="!inline-block !p-6 !bg-gray-100 !rounded-full !mb-6">
                <FaRegHeart className="!w-16 !h-16 !text-gray-400" />
              </div>
              <h3 className="!text-xl !font-semibold !text-gray-700 !mb-4">
                No items in wishlist
              </h3>
              <p className="!text-gray-500 !mb-8 !max-w-md !mx-auto">
                Items you add to your wishlist will appear here. Start exploring
                our collection!
              </p>
              <Link
                to="/products"
                className="!inline-block !px-8 !py-3 !bg-[var(--hover-color)] border !text-white
                 !rounded-lg hover:!text-emerald-500 hover:!border-emerald-500 hover:!bg-white !transition-colors !font-medium"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="wishlist-items"
              className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-6"
            >
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="!bg-white !rounded-xl !shadow-md !overflow-hidden !group !relative"
                >
                  {/* Product Image */}
                  <div className="!relative !overflow-hidden">
                    <img
                      src={`${url}${item.product.imageUrl}`}
                      alt={item.product?.name}
                      className="!w-full !h-48 !object-cover !group-hover:!scale-110 !transition-transform !duration-300"
                    />

                    {/* Quick Actions Overlay */}
                    <div className="!absolute !inset-0 !bg-black !bg-opacity-0 !group-hover:!bg-opacity-20 !transition-all !duration-300 !flex !items-center !justify-center !opacity-0 !group-hover:!opacity-100">
                      <div className="!flex !gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCart(item.product)}
                          className="!w-10 !h-10 !bg-white !rounded-full !flex !items-center !justify-center !shadow-lg hover:!bg-[var(--hover-color)] hover:!text-white !transition-colors"
                          title="Add to Cart"
                        >
                          <FaShoppingCart className="!w-4 !h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="!w-10 !h-10 !bg-white !rounded-full !flex !items-center !justify-center !shadow-lg hover:!bg-[var(--hover-color)] hover:!text-white !transition-colors"
                          title="View Details"
                        >
                          <FaEye className="!w-4 !h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="!p-4">
                    <Link to={`/product/${item.product?._id}`}>
                      <h3 className="!font-semibold !text-gray-900 !text-lg !mb-2 !line-clamp-2">
                        {item.product?.name || "Product Name"}
                      </h3>{" "}
                    </Link>

                    <div className="!flex !items-center !justify-between !mb-3">
                      <span className="!text-2xl !font-bold !text-[var(--hover-color)]">
                        ${item.product?.price?.toFixed(2) || "0.00"}
                      </span>
                      <span
                        className={`!text-sm !px-2 !py-1 !rounded-full ${
                          item.product?.stock > 0
                            ? "!bg-green-100 !text-green-800"
                            : "!bg-red-100 !text-red-800"
                        }`}
                      >
                        {item.product?.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="!flex !gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(item.product)}
                        disabled={item.product?.stock <= 0}
                        className="!flex-1 !px-4 !py-2 !bg-[var(--hover-color)] !text-white !rounded-lg hover:!bg-white !border  
                        disabled:!opacity-50 hover:!text-emerald-500 hover:!border-emerald-500
                        disabled:!cursor-not-allowed !transition-colors !text-sm !font-medium"
                      >
                        Add to Cart
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="!w-10 !h-10 !bg-gray-100 !text-red-500 !rounded-lg hover:!bg-red-500 hover:!text-white !flex !items-center !justify-center !transition-colors"
                        title="Remove from Wishlist"
                      >
                        <FaTrash className="!w-4 !h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Favorite Indicator */}
                  <div className="!absolute !top-3 !right-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="!w-8 !h-8 !bg-red-500 !rounded-full !flex !items-center !justify-center !shadow-lg"
                    >
                      <FaHeart className="!w-4 !h-4 !text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Shopping Button */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="!text-center !mt-12"
          >
            <Link
              to="/products"
              className="!inline-block !px-8 !py-3 !border !border-[var(--hover-color)]
               !text-[var(--hover-color)] !rounded-lg hover:!bg-[var(--hover-color)] hover:!text-emerald-500
               hover:!transition-all !duration-300 !font-medium"
            >
              Continue Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist;
