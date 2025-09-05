/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Rating,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
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
import { useAuth } from "../../Store/Auth";
import { toast } from "react-toastify";

const ProductDisplay = () => {
  const { user, url } = useAuth();
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
        className: "!rounded-xl !shadow-lg",
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

      toast.success("🛒 Product added to cart!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className: "!rounded-xl !shadow-lg !text-gray-800",
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
        className: "!rounded-xl !shadow-lg !text-gray-800",
      });
      console.error("Add to Cart Error:", error);
    }
  };

  const handleBuyNow = () => {
    // Buy now logic here
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);

    if (!isWishlisted) {
      toast.success("Added to wishlist!");
    } else {
      toast.info("Removed from wishlist!");
    }
  };

  if (loading) {
    return (
      <div className="!flex !items-center !justify-center !h-screen !bg-gradient-to-br !from-gray-50 !to-gray-100">
        <div className="!text-center">
          <CircularProgress
            className="!text-[var(--hover-color)] !mb-4"
            size={60}
            thickness={4}
          />
          <p className="!text-gray-600 !text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="!flex !items-center !justify-center !h-screen !bg-gradient-to-br !from-gray-50 !to-gray-100">
        <div className="!text-center !bg-white !p-8 !rounded-2xl !shadow-2xl !max-w-md">
          <div className="!text-red-500 !text-6xl !mb-4">⚠️</div>
          <h2 className="!text-2xl !font-bold !text-gray-800 !mb-2">
            Error Loading Product
          </h2>
          <p className="!text-gray-600 !mb-6">{error}</p>
          <Button
            variant="contained"
            className="!bg-[var(--hover-color)] !hover:bg-[var(--hover-color)]/90 !py-2 !px-6 !rounded-xl"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="!flex !items-center !justify-center !h-screen !bg-gradient-to-br !from-gray-50 !to-gray-100">
        <div className="!text-center !bg-white !p-8 !rounded-2xl !shadow-2xl !max-w-md">
          <div className="!text-gray-500 !text-6xl !mb-4">😞</div>
          <h2 className="!text-2xl !font-bold !text-gray-800 !mb-2">
            Product Not Found
          </h2>
          <p className="!text-gray-600 !mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button
            variant="contained"
            component={Link}
            to="/"
            className="!bg-[var(--hover-color)] !hover:bg-[var(--hover-color)]/90 !py-2 !px-6 !rounded-xl"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="!bg-gradient-to-br !from-gray-50 !to-gray-100 !min-h-screen !py-8">
      <div className="!container !mx-auto !px-4">
        {/* Breadcrumbs */}
        <div className="!flex !items-center !text-sm !text-gray-600 !mb-6 !bg-white !p-3 !rounded-xl !shadow-sm !max-w-fit">
          <span className="!hover:text-[var(--hover-color)] !cursor-pointer !transition-colors">
            <Link to="/">Home</Link>
          </span>
          <span className="!mx-2">/</span>
          <span className="!hover:text-[var(--hover-color)] !cursor-pointer !transition-colors">
            <Link to="/products">Products</Link>
          </span>
          <span className="!mx-2">/</span>
          <span className="!text-gray-900 !font-medium !truncate !max-w-xs">
            {product.name}
          </span>
        </div>

        {/* Product Main Section */}
        <div className="!flex !flex-col !lg:flex-row !gap-8 !w-full !bg-white !rounded-xl !shadow-[20px] !p-6 !transform !transition-all !duration-300 hover:!shadow-xl">
          {/* Product Images - Left Side */}
          <div className="!w-full !lg:w-1/2 !flex !gap-4">
            {/* Thumbnails Column */}
            <div className="!hidden !lg:flex !flex-col !gap-3 !w-20">
              {[product.imageUrl, ...(product.additionalImages || [])].map(
                (img, index) => (
                  <div
                    key={index}
                    className={`!cursor-pointer !border-2 !rounded-xl !overflow-hidden !transition-all !duration-200 !transform hover:!scale-105 ${
                      selectedImage === index
                        ? "!border-[var(--hover-color)] !shadow-md"
                        : "!border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={`${url}${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="!w-full !h-20 !object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </div>
                )
              )}
            </div>

            <div>
              {/* Main Image with 3D effect */}
              <div className="!flex-1 !bg-gradient-to-br w-[100%] !from-gray-100 !to-gray-200 !rounded-2xl !overflow-hidden !relative !transform !transition-all !duration-500 hover:!shadow-2xl">
                <div className="!absolute !inset-0 !bg-gradient-to-b !from-transparent !to-black/5 !pointer-events-none"></div>
                <img
                  src={`${url}${
                    [product.imageUrl, ...(product.additionalImages || [])][
                      selectedImage
                    ]
                  }`}
                  alt={product.name}
                  className="!w-full !h-auto !max-h-[500px] !object-contain !p-8 !transform !transition-transform !duration-500 hover:!scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/500";
                  }}
                />
              </div>
            </div>

            {/* Product Details - Right Side */}
            <div className="!w-full !lg:w-1/2 !flex !flex-col">
              <div className="!flex-1">
                <h1 className="!text-2xl !md:text-3xl !font-bold !text-gray-900 !mb-2 !leading-tight">
                  {product.name}
                </h1>

                <div className="!flex !items-center !mb-4">
                  <Rating
                    value={product.rating || 4}
                    precision={0.5}
                    readOnly
                    className="!text-yellow-400"
                  />
                  <span className="!text-sm !text-gray-500 !ml-2">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="!flex !items-center !gap-4 !mb-6">
                  <span className="!text-3xl !font-bold !text-[var(--hover-color)] !drop-shadow-sm">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="!text-xl !text-gray-500 !line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="!bg-rose-100 !text-rose-800 !text-sm !font-medium !px-3 !py-1 !rounded-full !shadow-sm">
                      Save {product.discount}%
                    </span>
                  )}
                </div>

                <p className="!text-gray-700 !mb-6 !leading-relaxed">
                  {product.description || "No description available."}
                </p>

                <div className="!flex !items-center !gap-4 !mb-6">
                  <div className="!flex !items-center !border !border-gray-300 !rounded-xl !overflow-hidden !shadow-sm">
                    <button
                      className="!px-4 !py-2 !bg-gray-100 !text-gray-700 !hover:bg-gray-200 !transition-colors !disabled:opacity-50 !disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="!px-4 !py-2 !text-center !w-12 !font-medium">
                      {quantity}
                    </span>
                    <button
                      className="!px-4 !py-2 !bg-gray-100 !text-gray-700 !hover:bg-gray-200 !transition-colors !disabled:opacity-50 !disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange("increment")}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="!text-sm !text-gray-500">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="!mt-auto">
                <div className="!flex !flex-wrap !gap-3 !mb-6">
                  <Button
                    variant="contained"
                    startIcon={<FaShoppingCart />}
                    className="!flex-1 !min-w-[150px] !py-3 !bg-gradient-to-r !from-emerald-500 !to-emerald-600 !hover:from-emerald-600 !hover:to-emerald-700 !shadow-lg !hover:shadow-xl !rounded-xl !transform !hover:-translate-y-0.5 !transition-all !duration-300"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.status === "inactive"}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    className="!flex-1 !min-w-[150px] !py-3 !border-emerald-500 !text-emerald-500 !hover:bg-emerald-500 !hover:text-white !shadow-sm !hover:shadow-md !rounded-xl !transform !hover:-translate-y-0.5 !transition-all !duration-300"
                    onClick={handleBuyNow}
                    disabled={product.status === "inactive"}
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="!flex !items-center !gap-4 !mb-6">
                  <IconButton
                    aria-label="wishlist"
                    onClick={toggleWishlist}
                    className={`!p-3 !rounded-full !shadow-sm !hover:shadow-md !transform !hover:-translate-y-0.5 !transition-all !duration-300 ${
                      isWishlisted
                        ? "!text-rose-500 !bg-rose-50"
                        : "!text-gray-500 !bg-gray-100"
                    }`}
                  >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                  </IconButton>
                  <IconButton
                    aria-label="compare"
                    className="!p-3 !text-gray-500 !bg-gray-100 !rounded-full !shadow-sm !hover:shadow-md !transform !hover:-translate-y-0.5 !transition-all !duration-300"
                  >
                    <MdCompareArrows />
                  </IconButton>
                  <IconButton
                    aria-label="share"
                    className="!p-3 !text-gray-500 !bg-gray-100 !rounded-full !shadow-sm !hover:shadow-md !transform !hover:-translate-y-0.5 !transition-all !duration-300"
                  >
                    <FaShareAlt />
                  </IconButton>
                </div>

                <div className="!border-t !border-gray-200 !pt-4 !mb-6">
                  <div className="!flex !items-center !gap-2 !text-sm !text-gray-600 !mb-2">
                    <span className="!font-medium">Category:</span>
                    <span className="!bg-gray-100 !px-2 !py-1 !rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="!flex !items-center !gap-2 !text-sm !text-gray-600">
                    <span className="!font-medium">SKU:</span>
                    <span className="!bg-gray-100 !px-2 !py-1 !rounded-full !font-mono">
                      {product._id}
                    </span>
                  </div>
                </div>

                <div className="!flex !items-center !gap-4">
                  <span className="!text-sm !font-medium">Share:</span>
                  <div className="!flex !gap-2">
                    <IconButton className="!text-blue-600 !bg-blue-50 !p-2 !rounded-full !hover:bg-blue-100 !transform !hover:-translate-y-0.5 !transition-all !duration-300">
                      <FaFacebook />
                    </IconButton>
                    <IconButton className="!text-blue-400 !bg-blue-50 !p-2 !rounded-full !hover:bg-blue-100 !transform !hover:-translate-y-0.5 !transition-all !duration-300">
                      <FaTwitter />
                    </IconButton>
                    <IconButton className="!text-pink-600 !bg-pink-50 !p-2 !rounded-full !hover:bg-pink-100 !transform !hover:-translate-y-0.5 !transition-all !duration-300">
                      <FaInstagram />
                    </IconButton>
                    <IconButton className="!text-red-600 !bg-red-50 !p-2 !rounded-full !hover:bg-red-100 !transform !hover:-translate-y-0.5 !transition-all !duration-300">
                      <FaPinterest />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="!bg-white !rounded-2xl !shadow-xl !mt-8 !overflow-hidden !transform !transition-all !duration-300 hover:!shadow-2xl">
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            className="!border-b !border-gray-200"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Description" className="!py-4 !font-medium" />
            <Tab label="Reviews" className="!py-4 !font-medium" />
            <Tab label="Shipping & Returns" className="!py-4 !font-medium" />
          </Tabs>

          <div className="!p-6">
            {tabValue === 0 && (
              <div>
                <h3 className="!text-xl !font-bold !mb-4 !text-gray-800">
                  Product Details
                </h3>
                <p className="!text-gray-700 !mb-6 !leading-relaxed">
                  {product.fullDescription ||
                    product.description ||
                    "No detailed description available."}
                </p>
                <ul className="!list-disc !pl-5 !text-gray-700 !space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="!leading-relaxed">
                      {feature}
                    </li>
                  )) || <li>No features listed</li>}
                </ul>
              </div>
            )}

            {tabValue === 1 && (
              <div>
                <h3 className="!text-xl !font-bold !mb-4 !text-gray-800">
                  Customer Reviews
                </h3>
                <div className="!flex !items-center !mb-6">
                  <Rating
                    value={product.rating || 4}
                    precision={0.5}
                    readOnly
                    size="large"
                    className="!text-yellow-400"
                  />
                  <span className="!text-lg !font-medium !ml-2">
                    {product.rating?.toFixed(1) || "4.0"} out of 5
                  </span>
                </div>
                <p className="!text-gray-500 !mb-6">
                  {product.reviewCount || 0} customer reviews
                </p>
                {/* Reviews would be mapped here */}
                <div className="!mt-8 !text-center !text-gray-500 !py-8 !bg-gray-50 !rounded-xl">
                  No reviews yet. Be the first to review!
                </div>
              </div>
            )}

            {tabValue === 2 && (
              <div>
                <h3 className="!text-xl !font-bold !mb-4 !text-gray-800">
                  Shipping Information
                </h3>
                <div className="!grid !grid-cols-1 !md:grid-cols-3 !gap-6 !mb-8">
                  <div className="!border !border-gray-200 !rounded-xl !p-4 !bg-gradient-to-b !from-white !to-gray-50 !shadow-sm !hover:shadow-md !transition-shadow !duration-300">
                    <h4 className="!font-medium !mb-2 !text-gray-800">
                      Free Shipping
                    </h4>
                    <p className="!text-sm !text-gray-600">
                      Free shipping on all orders over $50
                    </p>
                  </div>
                  <div className="!border !border-gray-200 !rounded-xl !p-4 !bg-gradient-to-b !from-white !to-gray-50 !shadow-sm !hover:shadow-md !transition-shadow !duration-300">
                    <h4 className="!font-medium !mb-2 !text-gray-800">
                      Fast Delivery
                    </h4>
                    <p className="!text-sm !text-gray-600">
                      Estimated 2-5 business days
                    </p>
                  </div>
                  <div className="!border !border-gray-200 !rounded-xl !p-4 !bg-gradient-to-b !from-white !to-gray-50 !shadow-sm !hover:shadow-md !transition-shadow !duration-300">
                    <h4 className="!font-medium !mb-2 !text-gray-800">
                      Easy Returns
                    </h4>
                    <p className="!text-sm !text-gray-600">
                      30-day return policy
                    </p>
                  </div>
                </div>
                <h3 className="!text-xl !font-bold !mb-4 !text-gray-800">
                  Return Policy
                </h3>
                <p className="!text-gray-700 !mb-4 !leading-relaxed">
                  We accept returns within 30 days of purchase. Items must be in
                  original condition with all tags attached.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="!mt-12">
          <h2 className="!text-2xl !font-bold !mb-6 !text-gray-800">
            You May Also Like
          </h2>
          <div className="!grid !grid-cols-1 !sm:grid-cols-2 !md:grid-cols-3 !lg:grid-cols-4 !gap-6">
            {/* Related products would be mapped here */}
            <div className="!text-center !text-gray-500 !py-12 !bg-gradient-to-b !from-white !to-gray-100 !rounded-2xl !shadow-md !hover:shadow-xl !transition-shadow !duration-300">
              <div className="!text-4xl !mb-4">🛍️</div>
              <p>Related products coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
