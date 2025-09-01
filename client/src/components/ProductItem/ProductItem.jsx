/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useAuth } from "../../Store/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductItem = ({ product }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: "50%", y: "50%" });
  const [isZooming, setIsZooming] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { user, url } = useAuth();

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${url}/api/wishlist/check/${product._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsWishlisted(response.data.isInWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [user, product._id]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const requestBody = { productId, quantity: 1 };

      await axios.post(`${url}/api/cart`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (isWishlisted) {
        await axios.delete(
          `${url}/api/wishlist/${product._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${url}/api/wishlist`,
          { productId: product._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <>
      <Link
        to={`/product/${product._id}`}
        className="!block !h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="!relative !bg-white !rounded-xl !shadow-md !overflow-hidden !h-full !group !transition-all !duration-300 hover:!shadow-lg hover:!-translate-y-1">
          {/* Product Image */}
          <div className="!relative !aspect-square !overflow-hidden">
            <img
              className="!w-full !h-full !object-cover !transition-transform !duration-500 group-hover:!scale-105"
              src={`${url}${product.imageUrl}`}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300";
              }}
            />

            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="!absolute !top-3 !left-3 !bg-[var(--hover-color)] !text-white !text-xs !font-bold !px-2 !py-1 !rounded-full !z-10">
                {product.discount}% OFF
              </span>
            )}

            {/* Quick Actions */}
            <div
              className={`!absolute !top-3 !right-3 !flex !flex-col !gap-2 !transition-all !duration-300 ${
                isHovered ? "!opacity-100" : "!opacity-0"
              }`}
            >
              <button
                onClick={toggleWishlist}
                className={`!w-9 !h-9 !rounded-full !flex !items-center !justify-center !transition-colors !duration-200 ${
                  isWishlisted
                    ? "!bg-rose-500 !text-white"
                    : "!bg-white !text-gray-700 hover:!bg-gray-100"
                }`}
              >
                {isWishlisted ? (
                  <FaHeart className="!text-sm" />
                ) : (
                  <FaRegHeart className="!text-sm" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDialogOpen();
                }}
                className="!w-9 !h-9 !rounded-full !bg-white !text-gray-700 !flex !items-center !justify-center hover:!bg-gray-100 !transition-colors !duration-200"
              >
                <MdOutlineZoomOutMap className="!text-sm" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="!p-4">
            <h3 className="!text-sm !font-medium !text-gray-900 !mb-1 !line-clamp-2 !h-10">
              {product.name}
            </h3>

            <div className="!flex !items-center !mb-2">
              <Rating
                value={product.rating || 4}
                precision={0.5}
                size="small"
                readOnly
              />
              <span className="!text-xs !text-gray-500 !ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>

            <div className="!flex !items-center !gap-2 !mb-3">
              <span className="!text-lg !font-bold !text-[var(--hover-color)]">
                Tk {product.price}
              </span>
              {product.originalPrice && (
                <span className="!text-sm !text-gray-500 !line-through">
                  Tk {product.originalPrice}
                </span>
              )}
            </div>

            <Button
              variant="outlined"
              fullWidth
              className="!py-2 !border-[var(--hover-color)] !text-[var(--hover-color)] hover:!bg-[var(--hover-color)] hover:!text-white !transition-colors !duration-300"
              onClick={(e) => handleAddToCart(e, product._id)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Quick View Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: "!rounded-xl" }}
      >
        <DialogTitle className="!flex !justify-between !items-center !border-b !border-gray-200">
          <span className="!text-xl !font-bold">{product.name}</span>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            className="!text-gray-500 hover:!bg-gray-100"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="!py-6">
          <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-8">
            {/* Product Image with Zoom */}
            <div
              className="!relative !h-80 !md:h-96 !bg-gray-100 !rounded-lg !overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              <img
                src={`${url}${product.imageUrl}`}
                alt={product.name}
                className="!w-full !h-full !object-contain !transition-transform !duration-300"
                style={{
                  transform: isZooming ? "scale(1.5)" : "scale(1)",
                  transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`,
                }}
              />
            </div>

            {/* Product Details */}
            <div>
              <div className="!flex !items-center !mb-4">
                <Rating value={product.rating || 4} precision={0.5} readOnly />
                <span className="!text-sm !text-gray-500 !ml-2">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="!flex !items-center !gap-4 !mb-4">
                <span className="!text-2xl !font-bold !text-[var(--hover-color)]">
                  Tk {product.price}
                </span>
                {product.originalPrice && (
                  <span className="!text-lg !text-gray-500 !line-through">
                    Tk {product.originalPrice}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="!bg-rose-100 !text-rose-800 !text-sm !font-medium !px-2 !py-1 !rounded">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              <p className="!text-gray-700 !mb-6">
                {product.description || "No description available."}
              </p>

              {/* Wishlist button in dialog */}
              <div className="!flex !gap-2 !mb-4">
                <Button
                  variant="outlined"
                  className={`!flex !items-center !gap-2 ${
                    isWishlisted
                      ? "!border-rose-500 !text-rose-500"
                      : "!border-gray-300 !text-gray-700"
                  }`}
                  onClick={toggleWishlist}
                >
                  {isWishlisted ? (
                    <>
                      <FaHeart className="!text-rose-500" />
                      Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <FaRegHeart />
                      Add to Wishlist
                    </>
                  )}
                </Button>
              </div>

              <div className="!flex !gap-4">
                <Button
                  variant="contained"
                  className="!flex-1 !py-3 !bg-[var(--hover-color)] hover:!bg-[var(--hover-color-dark)]"
                  onClick={(e) => handleAddToCart(e, product._id)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  className="!flex-1 !py-3 !border-[var(--hover-color)] !text-[var(--hover-color)] hover:!bg-[var(--hover-color-light)]"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductItem;
