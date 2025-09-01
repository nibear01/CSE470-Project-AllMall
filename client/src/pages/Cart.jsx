/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Store/Auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setTotalCartItem, url } = useAuth();

  useEffect(() => {
    setTotalCartItem(
      cartItems.reduce((total, item) => total + item.quantity, 0)
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
      toast.success("Item removed from cart");
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
        }
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
      toast.success("Cart cleared successfully");
      setCartItems([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
      console.error("Error clearing cart:", err);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.priceAtAddition * item.quantity,
    0
  );

  // Calculate total items
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex !items-center !justify-center !min-h-[50vh]"
      >
        <div className="text-center !py-8">
          <div className="inline-block !w-10 !h-10 !border-4 !border-t-[var(--hover-color)] !border-gray-200 !rounded-full !animate-spin"></div>
          <p className="!mt-4 !text-gray-600">Loading your cart...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center !py-8 !text-red-500"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <>
      <div className="!min-h-[80vh] !flex !justify-center !items-center !bg-gray-50 !p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full !max-w-6xl !min-h-[70vh] !h-auto !mx-auto !my-5 !p-4 md:!p-6 lg:!p-8 bg-white !rounded-lg !shadow-md !border-gray-200"
        >
          <div className="!max-w-full md:!max-w-[95%] !m-auto">
            <motion.h2
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="!text-2xl md:!text-3xl !font-semibold !text-center !my-6 !text-[var(--hover-color)]"
            >
              Your Cart {totalItems > 0 && `(${totalItems})`}
            </motion.h2>

            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  key="empty-cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="!text-center"
                >
                  <motion.p
                    className="!text-gray-500 !mb-6 !text-lg"
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                  >
                    Your cart is empty.
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/"
                      className="!inline-block !font-[500] !px-6 !py-3 !border-2 !border-[var(--hover-color)] !bg-[var(--hover-color)] !text-white !rounded-lg !shadow-md hover:!bg-white hover:!text-[var(--hover-color)] !transition-all !duration-300"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="cart-items"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="!space-y-6"
                >
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="!flex !flex-col md:!flex-row !items-center !justify-between !p-4 !border-b !border-gray-200 hover:!shadow-md !transition-all !duration-200 !bg-gray-50 !rounded-lg"
                      >
                        <div className="!flex !items-center !gap-4 !w-full md:!w-auto !mb-4 md:!mb-0">
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <img
                              src={
                                item.product?.imageUrl
                                  ? `${url}${item.product.imageUrl}`
                                  : "https://via.placeholder.com/80x80.png?text=Product"
                              }
                              alt={item.product?.name}
                              className="!w-16 !h-16 !object-cover !rounded-lg !shadow-sm"
                            />
                          </motion.div>
                          <div>
                            <Link to={`/product/${item.product?._id}`}>
                              <h6 className="!font-medium !text-gray-800 !text-[16px] hover:!text-[var(--hover-color)] !transition-colors">
                                {item.product?.name || "Product"}
                              </h6>
                            </Link>
                            <p className="!text-gray-600 !text-sm">
                              Tk.{item.priceAtAddition.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        <div className="!flex !items-center !justify-between !w-full md:!w-auto !gap-6">
                          <div className="!flex !items-center !gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              className="!w-6 !h-6 !flex !items-center !justify-center !border border-gray-400 !rounded-full !bg-white hover:!bg-gray-100 !transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </motion.button>
                            <span className="!mx-2 !font-medium !min-w-[20px] !text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              className="!w-6 !h-6 !flex !items-center !justify-center !border border-gray-400 !rounded-full !bg-white hover:!bg-gray-100 !transition-colors"
                            >
                              +
                            </motion.button>
                          </div>

                          <div className="!text-right !flex !flex-col !items-end !gap-2">
                            <p className="!text-[var(--hover-color)] !font-semibold !text-lg">
                              Tk.
                              {(item.priceAtAddition * item.quantity).toFixed(
                                2
                              )}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="!px-3 !py-1 !border !border-red-500 !bg-white !text-red-500 !rounded-full !text-sm hover:!bg-red-500 hover:!text-white !transition-colors"
                              onClick={() => handleRemoveItem(item._id)}
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.div
                    className="!flex !flex-col md:!flex-row !items-center !justify-between !p-6 !mt-4 !bg-gray-50 !rounded-lg !shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClearCart}
                      className="!px-4 !py-2 !mb-4 md:!mb-0 !text-sm !text-red-500 hover:!text-red-700 !bg-white !border !border-red-300 !rounded-full !transition-colors"
                    >
                      Clear Entire Cart
                    </motion.button>
                    <div className="!text-right">
                      <span className="!text-lg !font-semibold !text-gray-700">
                        Total:
                      </span>
                      <span className="!text-2xl !font-bold !text-[var(--hover-color)] !ml-3">
                        Tk.{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="!text-center !my-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to="/checkout"
                        className="!inline-block !font-[600] !px-6 !py-3 !border-1 !border-[var(--hover-color)] !bg-[var(--hover-color)]
                         !text-white !rounded-lg !shadow-lg hover:!bg-white hover:!text-[var(--hover-color)] !transition-all !duration-200"
                      >
                        Proceed to Checkout
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Cart;
