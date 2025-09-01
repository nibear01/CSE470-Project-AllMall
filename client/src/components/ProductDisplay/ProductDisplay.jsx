import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Rating,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import axios from "axios";

const ProductDisplay = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
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

  const handleAddToCart = () => {
    setSnackbarMessage("Product added to cart!");
    setSnackbarOpen(true);
    // Add to cart logic here
  };

  const handleBuyNow = () => {
    // Buy now logic here
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    setSnackbarMessage(
      !isWishlisted ? "Added to wishlist!" : "Removed from wishlist!"
    );
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <div className="!flex !items-center !justify-center !h-screen">
        <CircularProgress className="!text-[var(--hover-color)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="!flex !items-center !justify-center !h-screen !text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="!flex !items-center !justify-center !h-screen">
        Product not found
      </div>
    );
  }

  return (
    <div className="!bg-gray-50 !min-h-screen !py-8">
      <div className="!container !mx-auto !px-4">
        {/* Breadcrumbs */}
        <div className="!flex !items-center !text-sm !text-gray-600 !mb-6">
          <span className="!hover:text-[var(--hover-color)] !cursor-pointer">
            <Link to="/"> Home</Link>
          </span>
          <span className="!mx-2">/</span>
          <span className="!hover:text-[var(--hover-color)] !cursor-pointer">
            Products
          </span>
          <span className="!mx-2">/</span>
          <span className="!text-gray-900 !font-medium">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 !w-[90%] !m-auto bg-white rounded-xl shadow-md !p-6">
          {/* Product Images - Left Side */}
          <div className="!w-full lg:w-1/2 flex gap-4">
            {/* Thumbnails Column */}
            <div className="hidden lg:flex flex-col gap-3 w-20">
              {[product.imageUrl, ...(product.additionalImages || [])].map(
                (img, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === index
                        ? "border-[var(--hover-color)]"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={`http://localhost:5000${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </div>
                )
              )}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={`http://localhost:5000${
                  [product.imageUrl, ...(product.additionalImages || [])][
                    selectedImage
                  ]
                }`}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain !p-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500";
                }}
              />
            </div>
          </div>

          {/* Product Details - Right Side */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 !mb-2">
                {product.name}
              </h1>

              <div className="flex items-center !mb-4">
                <Rating value={product.rating || 4} precision={0.5} readOnly />
                <span className="text-sm text-gray-500 !ml-2">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 !mb-6">
                <span className="text-3xl font-bold text-[var(--hover-color)]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-rose-100 text-rose-800 text-sm font-medium !px-2 !py-1 rounded">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              <p className="text-gray-700 !mb-6">
                {product.description || "No description available."}
              </p>

              <div className="flex items-center !gap-4 !mb-6">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    className="!px-3 !py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="!px-4 !py-2 text-center w-12">{quantity}</span>
                  <button
                    className="!px-3 !py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              <div className="flex flex-wrap gap-3 !mb-6">
                <Button
                  variant="contained"
                  startIcon={<FaShoppingCart />}
                  className="flex-1 w-[150px] !py-2 !bg-emerald-500 hover:!bg-emerald-600"
                  onClick={handleAddToCart}
                  disabled={product.status === "inactive"}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  className="flex-1 w-[150px] !py-2 !border-emerald-500 !text-emerald-500 "
                  onClick={handleBuyNow}
                  disabled={product.status === "inactive"}
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <IconButton
                  aria-label="wishlist"
                  onClick={toggleWishlist}
                  className={`p-2 rounded-full ${
                    isWishlisted ? "text-rose-500" : "text-gray-500"
                  }`}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </IconButton>
                <IconButton
                  aria-label="compare"
                  className="p-2 text-gray-500 rounded-full"
                >
                  <MdCompareArrows />
                </IconButton>
                <IconButton
                  aria-label="share"
                  className="p-2 text-gray-500 rounded-full"
                >
                  <FaShareAlt />
                </IconButton>
              </div>

              <div className="border-t border-gray-200 !pt-4 !mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 !mb-2">
                  <span className="font-medium">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">SKU:</span>
                  <span>{product._id}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Share:</span>
                <div className="flex gap-2">
                  <IconButton className="!text-blue-600 !p-1">
                    <FaFacebook />
                  </IconButton>
                  <IconButton className="!text-blue-400 !p-1">
                    <FaTwitter />
                  </IconButton>
                  <IconButton className="!text-pink-600 !p-1">
                    <FaInstagram />
                  </IconButton>
                  <IconButton className="!text-red-600 !p-1">
                    <FaPinterest />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="!bg-white !rounded-xl !shadow-md !mt-8 !overflow-hidden">
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            className="!border-b !border-gray-200"
          >
            <Tab label="Description" className="!py-4" />
            <Tab label="Reviews" className="!py-4" />
            <Tab label="Shipping & Returns" className="!py-4" />
          </Tabs>

          <div className="!p-6">
            {tabValue === 0 && (
              <div>
                <h3 className="!text-lg !font-bold !mb-4">Product Details</h3>
                <p className="!text-gray-700 !mb-6">
                  {product.fullDescription ||
                    product.description ||
                    "No detailed description available."}
                </p>
                <ul className="!list-disc !pl-5 !text-gray-700 !space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  )) || <li>No features listed</li>}
                </ul>
              </div>
            )}

            {tabValue === 1 && (
              <div>
                <h3 className="!text-lg !font-bold !mb-4">Customer Reviews</h3>
                <div className="!flex !items-center !mb-6">
                  <Rating
                    value={product.rating || 4}
                    precision={0.5}
                    readOnly
                    size="large"
                  />
                  <span className="!text-lg !font-medium !ml-2">
                    {product.rating?.toFixed(1) || "4.0"} out of 5
                  </span>
                </div>
                <p className="!text-gray-500">
                  {product.reviewCount || 0} customer reviews
                </p>
                {/* Reviews would be mapped here */}
                <div className="!mt-8 !text-center !text-gray-500">
                  No reviews yet. Be the first to review!
                </div>
              </div>
            )}

            {tabValue === 2 && (
              <div>
                <h3 className="!text-lg !font-bold !mb-4">
                  Shipping Information
                </h3>
                <div className="!grid !grid-cols-1 !md:grid-cols-3 !gap-6 !mb-8">
                  <div className="!border !border-gray-200 !rounded-lg !p-4">
                    <h4 className="!font-medium !mb-2">Free Shipping</h4>
                    <p className="!text-sm !text-gray-600">
                      Free shipping on all orders over $50
                    </p>
                  </div>
                  <div className="!border !border-gray-200 !rounded-lg !p-4">
                    <h4 className="!font-medium !mb-2">Fast Delivery</h4>
                    <p className="!text-sm !text-gray-600">
                      Estimated 2-5 business days
                    </p>
                  </div>
                  <div className="!border !border-gray-200 !rounded-lg !p-4">
                    <h4 className="!font-medium !mb-2">Easy Returns</h4>
                    <p className="!text-sm !text-gray-600">
                      30-day return policy
                    </p>
                  </div>
                </div>
                <h3 className="!text-lg !font-bold !mb-4">Return Policy</h3>
                <p className="!text-gray-700 !mb-4">
                  We accept returns within 30 days of purchase. Items must be in
                  original condition with all tags attached.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="!mt-12">
          <h2 className="!text-xl !font-bold !mb-6">You May Also Like</h2>
          <div className="!grid !grid-cols-2 !md:grid-cols-4 !gap-6">
            {/* Related products would be mapped here */}
            <div className="!text-center !text-gray-500 !py-8 !bg-gray-100 !rounded-lg">
              Related products coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          className="!bg-green-50 !text-green-800"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDisplay;
