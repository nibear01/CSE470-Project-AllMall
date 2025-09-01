const Wishlist = require("../models/wishlist-model");
const Product = require("../models/product-model");
const mongoose = require("mongoose");

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.userId })
      .populate({
        path: 'items.product',
        select: 'name price imageUrl stock status',
        match: { status: 'active' } // Only include active products
      })
      .lean();

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: { items: [], itemCount: 0 }
      });
    }

    // Filter out products that might be null due to population matching
    wishlist.items = wishlist.items.filter(item => item.product !== null);

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    // Find or create user's wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add new item to wishlist
    wishlist.items.push({ product: productId });

    await wishlist.save();

    // Populate the newly added item
    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate({
        path: 'items.product',
        select: 'name price imageUrl stock status'
      })
      .lean();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Validate input
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Check if product exists in wishlist
    const itemIndex = wishlist.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    // Remove the item
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate({
        path: 'items.product',
        select: 'name price imageUrl stock status'
      })
      .lean();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Clear all items
    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist: { items: [], itemCount: 0 }
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Check if product is in wishlist
const checkInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const wishlist = await Wishlist.findOne({ 
      user: userId,
      'items.product': productId 
    });

    res.status(200).json({
      success: true,
      isInWishlist: !!wishlist
    });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkInWishlist
};