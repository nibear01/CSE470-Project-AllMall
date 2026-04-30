/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaHeart,
  FaShare,
  FaLock,
  FaShieldAlt,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import { useAuth } from "../Store/Auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const { setTotalCartItem, url } = useAuth();

  useEffect(() => {
    setTotalCartItem(
      cartItems.reduce((total, item) => total + item.quantity, 0),
    );
  }, [cartItems, setTotalCartItem]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(response.data.cart?.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart");
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`${url}/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("🗑️ Item removed from cart");
      fetchCart(); // Refresh cart data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
      console.error("Error removing item:", err);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(
        `${url}/api/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchCart(); // Refresh cart data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
      console.error("Error updating quantity:", err);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      await axios.delete(`${url}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("🛒 Cart cleared successfully");
      setCartItems([]);
      setSelectedItems(new Set());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
      console.error("Error clearing cart:", err);
    }
  };

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item._id)));
    }
  };

  // Calculate selected items price
  const selectedItemsPrice = cartItems.reduce(
    (total, item) =>
      selectedItems.has(item._id)
        ? total + item.priceAtAddition * item.quantity
        : total,
    0,
  );

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.priceAtAddition * item.quantity,
    0,
  );

  // Calculate total items
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Move to wishlist
  const moveToWishlist = async (itemId) => {
    try {
      // This would be your API call to move item to wishlist
      toast.info("Feature coming soon!");
    } catch (err) {
      toast.error("Failed to move to wishlist");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh] bg-gray-50"
      >
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-t-emerald-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center flex-col py-12 min-h-[60vh] bg-gray-50"
      >
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={fetchCart}
          className=" px-6 py-2 bg-emerald-600 border text-white rounded-lg hover:bg-white hover:text-emerald-600 hover:border-emerald-600 transition-colors"
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
      className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6 sm:mb-8 px-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            {cartItems.length === 0
              ? "Your cart is empty. Start adding items you love!"
              : `You have ${totalItems} item${
                  totalItems !== 1 ? "s" : ""
                } in your cart`}
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {cartItems.length === 0 ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl shadow-sm mx-2 sm:mx-0"
            >
              <div className="inline-block p-4 sm:p-6 bg-gray-100 rounded-full mb-4 sm:mb-6">
                <FaShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
                No items in cart
              </h3>
              <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
                Items you add to your cart will appear here. Start exploring our
                collection!
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 bg-emerald-600 border text-white
                 rounded-lg hover:text-emerald-600 hover:border-emerald-600 hover:bg-white transition-colors font-medium"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart-items"
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Cart Actions */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length}
                      onChange={selectAllItems}
                      className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 rounded mr-2 sm:mr-3"
                    />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      Select all ({selectedItems.size}/{cartItems.length})
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearCart}
                    className="px-3 sm:px-4 py-2 bg-gray-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap ml-auto sm:ml-0"
                  >
                    <FaTrash className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="hidden sm:inline">Clear Cart</span>
                    <span className="sm:hidden">Clear</span>
                  </motion.button>
                </div>

                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden group relative p-3 sm:p-6"
                  >
                    <div className="flex items-start gap-3 sm:gap-5 flex-col sm:flex-row">
                      {/* Selection Checkbox */}
                      <div className="flex items-start gap-3 sm:gap-5 w-full sm:w-auto">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 rounded mt-1"
                        />

                        {/* Product Image */}
                        <div className="relative overflow-hidden shrink-0">
                          <img
                            src={
                              item.product?.imageUrl
                                ? `${url}${item.product.imageUrl}`
                                : "https://via.placeholder.com/120x120.png?text=Product"
                            }
                            alt={item.product?.name}
                            className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 w-full">
                        <Link to={`/product/${item.product?._id}`}>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-2 hover:text-emerald-600 transition-colors line-clamp-2 sm:line-clamp-1">
                            {item.product?.name || "Product Name"}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                          <span className="text-xs sm:text-sm text-gray-500">
                            Seller: YourStore
                          </span>
                          <span className="text-gray-300">•</span>
                          <span
                            className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                              item.product?.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.product?.stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                            Tk {item.priceAtAddition.toFixed(2)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            {item.product?.originalPrice
                              ? `Tk ${item.product.originalPrice.toFixed(2)}`
                              : ""}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-lg p-1 w-full sm:w-auto justify-center sm:justify-start">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-7 sm:w-8 h-7 sm:h-8 bg-white rounded-md flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaMinus className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            </motion.button>

                            <span className="mx-1 sm:mx-2 font-medium min-w-4 sm:min-w-5 text-center">
                              {item.quantity}
                            </span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity + 1,
                                )
                              }
                              disabled={item.quantity >= item.product?.stock}
                              className="w-7 sm:w-8 h-7 sm:h-8 bg-white rounded-md flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaPlus className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-9 sm:w-10 h-9 sm:h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                              title="Share"
                            >
                              <FaShare className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveItem(item._id)}
                              className="w-9 sm:w-10 h-9 sm:h-10 bg-gray-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                              title="Remove from Cart"
                            >
                              <FaTrash className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Estimate */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                      <FaTruck className="text-emerald-600" />
                      <span>
                        Delivery by{" "}
                        {new Date(
                          Date.now() + 3 * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()}{" "}
                        • Free
                      </span>
                    </div>

                    {/* Return Policy */}
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <FaUndo className="text-gray-400" />
                      <span>14 days return policy</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (All items)</span>
                    <span className="font-medium">
                      Tk {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-Tk 0.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-green-600">60</span>
                  </div>

                  <div className="h-px bg-gray-200 my-4"></div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">
                      Tk {(60 + totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-white 
                    hover:text-emerald-600 hover:border-emerald-600 hover:border text-center font-medium transition-colors"
                  >
                    Proceed to Checkout
                    {/* ({selectedItems.size}) */}
                  </Link>

                  <Link
                    to="/products"
                    className="block w-full px-6 py-3 border border-emerald-600 text-emerald-600 
                    rounded-lg hover:bg-emerald-600 hover:text-white text-center font-medium transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Security & Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <FaLock className="text-green-500" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaShieldAlt className="text-blue-500" />
                      <span>Buyer protection</span>
                    </div>
                  </div>
                </div>

                {/* Promotional Banner */}
                <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg text-center">
                  <h3 className="font-medium text-gray-900 mb-1">
                    Free Delivery!
                  </h3>
                  <p className="text-xs text-gray-600">
                    On orders over Tk 5000
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Cart;
