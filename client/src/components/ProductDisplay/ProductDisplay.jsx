/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Rating, Tabs, Tab, CircularProgress } from "@mui/material";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaCheck,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../Store/Auth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProductDisplay = () => {
  const { user, url, refreshCartCount } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${url}/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => Math.min(prev + 1, product.stock));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.", {
        theme: "light",
        className: "rounded-xl shadow-lg",
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        productId,
        quantity,
      };

      await axios.post(`${url}/api/cart`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshCartCount();

      toast.success("🛒 Product added to cart!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className: "rounded-xl shadow-lg text-gray-800",
      });
    } catch (error) {
      toast.error("Failed to add product to cart.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className: "rounded-xl shadow-lg text-gray-800",
      });
      console.error("Add to Cart Error:", error);
    }
  };

  const handleBuyNow = () => {
    // Buy now logic here
  };

  const toggleWishlist = async () => {
    if (!isWishlisted) {
      try {
        await axios.post(
          `${url}/api/wishlist`,
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      } catch (error) {
        toast.error(`Failed to add to wishlist ${error.message}`);
      }
    } else {
      try {
        await axios.delete(`${url}/api/wishlist/${product._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsWishlisted(false);
        toast.info("Removed from wishlist!");
      } catch (error) {
        toast.error(`Failed to remove from wishlist ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 via-gray-100 to-emerald-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-center"
        >
          <CircularProgress size={80} thickness={4} sx={{ color: "#059669" }} />
          <p className="text-gray-700 text-lg mt-6 font-medium">
            Loading product details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 via-gray-100 to-emerald-50"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-gray-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-black mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 via-gray-100 to-emerald-50"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-black mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-700 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-sm text-gray-700 mb-8 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg border border-gray-200 w-fit"
        >
          <Link
            to="/"
            className="hover:text-emerald-600 transition-colors duration-300 font-medium"
          >
            Home
          </Link>
          <span className="mx-3 text-gray-400">/</span>
          <Link
            to="/products"
            className="hover:text-emerald-600 transition-colors duration-300 font-medium"
          >
            Products
          </Link>
          <span className="mx-3 text-gray-400">/</span>
          <span className="text-black font-bold truncate max-w-xs">
            {product.name}
          </span>
        </motion.div>

        {/* Product Main Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Product Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl"
          >
            {/* Main Image */}
            <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-6 relative group">
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10 pointer-events-none z-10"></div>
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={`${url}${
                  [product.imageUrl, ...(product.additionalImages || [])][
                    selectedImage
                  ]
                }`}
                alt={product.name}
                className="w-full h-80 sm:h-96 object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500";
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.imageUrl, ...(product.additionalImages || [])].map(
                (img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                      selectedImage === index
                        ? "border-emerald-600 shadow-lg shadow-emerald-500/30"
                        : "border-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    <img
                      src={`${url}${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>

          {/* Product Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Rating
                    value={product.rating || 4}
                    precision={0.5}
                    readOnly
                    size="large"
                    sx={{
                      color: "#fbbf24",
                      "& .MuiRating-icon": {
                        color: "#fbbf24",
                      },
                    }}
                  />
                  <span className="text-sm text-gray-700 ml-2">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
                <span className="text-sm px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-300 font-medium">
                  In Stock
                </span>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-8 flex-wrap">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-emerald-600"
                >
                  Tk {product.price}
                </motion.div>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    Tk {product.originalPrice}
                  </span>
                )}
                {product.discount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-linear-to-r from-rose-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"
                  >
                    Save {product.discount}%
                  </motion.span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {product.description || "No description available."}
              </p>
            </motion.div>

            {/* Quantity & Stock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 mb-8 flex-wrap"
            >
              <div className="bg-gray-200 border border-gray-300 rounded-xl p-2 flex items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="px-4 py-2 text-black hover:text-emerald-600 transition-colors disabled:opacity-50"
                >
                  −
                </motion.button>
                <span className="px-6 py-2 text-black font-bold w-16 text-center">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= product.stock}
                  className="px-4 py-2 text-black hover:text-emerald-600 transition-colors disabled:opacity-50"
                >
                  +
                </motion.button>
              </div>
              <span className="text-gray-700">
                <span className="font-bold text-emerald-600">
                  {product.stock}
                </span>{" "}
                items available
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart(product._id)}
                disabled={product.status === "inactive"}
                className="flex-1 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                <FaShoppingCart size={24} />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={product.status === "inactive"}
                className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Buy Now
              </motion.button>
            </motion.div>

            {/* Secondary Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleWishlist}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  isWishlisted
                    ? "bg-rose-100 text-rose-600 border border-rose-300"
                    : "bg-gray-200 text-gray-600 border border-gray-300 hover:text-rose-600"
                }`}
              >
                {isWishlisted ? (
                  <FaHeart size={24} />
                ) : (
                  <FaRegHeart size={24} />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-gray-200 text-gray-600 rounded-xl border border-gray-300 hover:text-emerald-600 transition-all duration-300"
              >
                <MdCompareArrows size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-gray-200 text-gray-600 rounded-xl border border-gray-300 hover:text-blue-600 transition-all duration-300"
              >
                <FaShareAlt size={24} />
              </motion.button>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 text-gray-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <FaTruck className="text-emerald-600 text-xl shrink-0" />
                <span className="text-sm">
                  Free delivery on orders over Tk 5000
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <FaShieldAlt className="text-blue-600 text-xl shrink-0" />
                <span className="text-sm">
                  30-day return policy for peace of mind
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-green-50 p-4 rounded-xl border border-green-200">
                <FaCheck className="text-green-600 text-xl shrink-0" />
                <span className="text-sm">
                  100% authentic products guaranteed
                </span>
              </div>
            </motion.div>

            {/* Social Share */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-8 border-t border-gray-300 flex items-center gap-4"
            >
              <span className="text-gray-700 font-medium">Share:</span>
              <div className="flex gap-3">
                {[
                  { icon: FaFacebook, color: "text-blue-600" },
                  { icon: FaTwitter, color: "text-blue-400" },
                  { icon: FaInstagram, color: "text-pink-600" },
                  { icon: FaPinterest, color: "text-red-600" },
                ].map((social, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-gray-200 rounded-full border border-gray-300 hover:bg-gray-300 transition-all duration-300 ${social.color}`}
                  >
                    <social.icon size={20} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Product Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8"
        >
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            className="border-b border-gray-200"
            sx={{
              "& .MuiTab-root": {
                color: "#6b7280",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                py: 2,
                "&.Mui-selected": {
                  color: "#059669",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#059669",
                height: 3,
              },
            }}
          >
            <Tab label="Description" />
            <Tab label="Reviews" />
            <Tab label="Shipping & Returns" />
          </Tabs>

          <div className="p-8 text-gray-700">
            {tabValue === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-bold text-black mb-4">
                  Product Details
                </h3>
                <p className="mb-6 text-lg leading-relaxed">
                  {product.fullDescription ||
                    product.description ||
                    "No detailed description available."}
                </p>
                <h4 className="text-xl font-bold text-black mb-4">Features:</h4>
                <ul className="space-y-3 pl-4">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaCheck className="text-emerald-600 mt-1 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  )) || (
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-emerald-600 mt-1" /> No features
                      listed
                    </li>
                  )}
                </ul>
              </motion.div>
            )}

            {tabValue === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-bold text-black mb-4">
                  Customer Reviews
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <Rating
                    value={product.rating || 4}
                    precision={0.5}
                    readOnly
                    size="large"
                    sx={{
                      color: "#fbbf24",
                    }}
                  />
                  <span className="text-xl font-bold text-black">
                    {product.rating?.toFixed(1) || "4.0"} / 5
                  </span>
                </div>
                <p className="text-lg mb-6 text-gray-700">
                  Based on {product.reviewCount || 0} reviews
                </p>
                <div className="text-center py-12 bg-gray-100 rounded-xl border border-gray-300">
                  <p className="text-gray-600 text-lg">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              </motion.div>
            )}

            {tabValue === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-bold text-black mb-6">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { title: "Free Shipping", desc: "On orders over Tk 5000" },
                    { title: "Fast Delivery", desc: "2-5 business days" },
                    { title: "Easy Returns", desc: "30-day return policy" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ translateY: -5 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 hover:bg-emerald-100 transition-all duration-300"
                    >
                      <h4 className="font-bold text-emerald-700 mb-2 text-lg">
                        {item.title}
                      </h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">
                  Return Policy
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  We accept returns within 30 days of purchase. Items must be in
                  original condition with all tags attached. Simply contact our
                  support team to initiate a return.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-black mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1].map((item) => (
              <motion.div
                key={item}
                whileHover={{ translateY: -10 }}
                className="bg-gray-100 border border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-200 transition-all duration-300"
              >
                <div className="text-5xl mb-4">🛍️</div>
                <p className="text-gray-700 text-lg">
                  Related products coming soon
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDisplay;
