/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaBolt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Store/Auth";

const Checkout = () => {
  const { url } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "cod",
  });
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.cart?.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.priceAtAddition * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 60 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to place an order");
        navigate("/login");
        return;
      }

      const orderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || "",
      };

      console.log("Sending order data:", orderData);

      const response = await axios.post(`${url}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Order response:", response.data);

      setOrderId(response.data.orderId);
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);

      if (error.response) {
        console.error("Server error details:", error.response.data);
        toast.error(
          error.response.data.message ||
            "Failed to place order. Please check your information."
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const { subtotal, shipping, total } = calculateTotals();

  if (loading) {
    return (
      <div className="!flex !items-center !justify-center !min-h-screen">
        <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-[var(--hover-color)]"></div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="!min-h-screen !bg-gray-50 !py-12 !px-4 sm:!px-6 lg:!px-8"
      >
        <div className="!max-w-2xl !mx-auto !text-center">
          <div className="!bg-white !rounded-xl !shadow-md !p-8">
            <div className="!w-16 !h-16 !bg-green-100 !rounded-full !flex !items-center !justify-center !mx-auto !mb-6">
              <svg
                className="!w-8 !h-8 !text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="!text-2xl !font-bold !text-gray-900 !mb-4">
              Order Placed Successfully!
            </h2>
            <p className="!text-gray-600 !mb-6">
              Thank you for your order. Your order ID is:{" "}
              <span className="!font-semibold">{orderId}</span>
            </p>
            <p className="!text-gray-500 !mb-8">
              You will receive a confirmation email shortly. Your order will be
              delivered within 3-5 business days.
            </p>
            <div className="!flex !gap-4 !justify-center">
              <Link
                to="/products"
                className="!px-6 !py-3 !bg-[var(--hover-color)] !text-white !rounded-lg !hover:bg-[var(--hover-color-dark)] !transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/my-orders"
                className="!px-6 !py-3 !border !border-[var(--hover-color)] !text-[var(--hover-color)] !rounded-lg !hover:bg-[var(--hover-color-light)] !transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="!min-h-screen !bg-gray-50 !py-8 !px-4 sm:!px-6 lg:!px-8"
    >
      <div className="!max-w-7xl !mx-auto">
        <h1 className="!text-3xl !font-bold !text-center !text-gray-900 !mb-8">
          Checkout
        </h1>

        <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
          {/* Left Column */}
          <div className="!bg-white !rounded-xl !shadow-md !p-6">
            <h2 className="!text-xl !font-semibold !text-gray-900 !mb-6 !flex !items-center">
              <FaUser className="!mr-2 !text-[var(--hover-color)]" />
              Shipping Information
            </h2>

            <form onSubmit={handlePlaceOrder} className="!space-y-4">
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <div>
                  <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                />
              </div>

              <div>
                <label className="!text-sm !font-medium !text-gray-700 !mb-1 !flex !items-center">
                  <FaPhone className="!mr-2 !text-sm" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                />
              </div>

              <div>
                <label className="!text-sm !font-medium !text-gray-700 !mb-1 !flex !items-center">
                  <FaMapMarkerAlt className="!mr-2 !text-sm" />
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                />
              </div>

              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <div>
                  <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="!pt-6 !border-t !border-gray-200">
                <h2 className="!text-xl !font-semibold !text-gray-900 !mb-4 !flex !items-center">
                  <FaLock className="!mr-2 !text-[var(--hover-color)]" />
                  Payment Method
                </h2>

                <div className="!space-y-3">
                  <label className="!flex !items-center !p-4 !border !border-gray-300 !rounded-lg !cursor-pointer !hover:border-[var(--hover-color)] !transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="!text-[var(--hover-color)] !focus:ring-[var(--hover-color)]"
                    />
                    <div className="!ml-3 !flex !items-center">
                      <FaMoneyBillWave className="!text-green-600 !mr-2" />
                      <span className="!text-gray-700">Cash on Delivery</span>
                    </div>
                  </label>

                  <label className="!flex !items-center !p-4 !border !border-gray-300 !rounded-lg !opacity-60 !cursor-not-allowed">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      disabled
                      className="!text-gray-400"
                    />
                    <div className="!ml-3 !flex !items-center">
                      <img
                        src="/src/assets/bkash-seeklogo.png"
                        className="!text-orange-500 !mr-2 h-5 w-12"
                      />
                      <span className="!text-gray-500">
                        bKash (Coming Soon)
                      </span>
                    </div>
                  </label>

                  <label className="!flex !items-center !p-4 !border !border-gray-300 !rounded-lg !opacity-60 !cursor-not-allowed">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      className="!text-gray-400"
                    />
                    <div className="!ml-3 !flex !items-center">
                      <FaCreditCard className="!text-blue-600 !mr-2" />
                      <span className="!text-gray-500">
                        Credit/Debit Card (Coming Soon)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="!w-full !py-3 !px-6 !bg-[var(--hover-color)] !text-white !rounded-lg !font-semibold hover:!bg-white
                border hover:!border-emerald-500 hover:!text-emerald-500 
                disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Right Column */}
          <div className="!bg-white !rounded-xl !shadow-md !p-6 !h-fit !sticky !top-8">
            <h2 className="!text-xl !font-semibold !text-gray-900 !mb-6">
              Order Summary
            </h2>

            {cartItems.length === 0 ? (
              <div className="!text-center !py-8">
                <p className="!text-gray-500 !mb-4">Your cart is empty</p>
                <Link
                  to="/products"
                  className="!text-[var(--hover-color)] !hover:text-[var(--hover-color-dark)]"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="!space-y-4 !mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="!flex !items-center !justify-between !py-2 !border-b !border-gray-100"
                    >
                      <div className="!flex !items-center !space-x-3">
                        <img
                          src={`${url}${item.product?.imageUrl}`}
                          alt={item.product?.name}
                          className="!w-12 !h-12 !object-cover !rounded"
                        />
                        <div>
                          <p className="!text-sm !font-medium !text-gray-900">
                            {item.product?.name}
                          </p>
                          <p className="!text-xs !text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="!text-sm !font-semibold !text-gray-900">
                        ৳{(item.priceAtAddition * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="!space-y-3 !border-t !border-gray-200 !pt-4">
                  <div className="!flex !justify-between !text-sm">
                    <span className="!text-gray-600">Subtotal</span>
                    <span className="!text-gray-900">
                      ৳{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="!flex !justify-between !text-sm">
                    <span className="!text-gray-600">Shipping</span>
                    <span className="!text-gray-900">
                      ৳{shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="!flex !justify-between !text-lg !font-semibold !border-t !border-gray-200 !pt-3">
                    <span className="!text-gray-900">Total</span>
                    <span className="!text-[var(--hover-color)]">
                      ৳{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="!mt-6 !p-4 !bg-green-50 !rounded-lg">
                  <p className="!text-sm !text-green-800 !text-center">
                    <strong>Cash on Delivery:</strong> Pay when your order is
                    delivered
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
