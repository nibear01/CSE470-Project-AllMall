const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist-controller");
const authenticateUser = require("../middlewares/authenticate");

// All routes require authentication
router.use(authenticateUser);

//Get user's wishlist
router.get("/", wishlistController.getWishlist);

//Add item to wishlist
router.post("/", wishlistController.addToWishlist);

//Remove item from wishlist
router.delete("/:productId", wishlistController.removeFromWishlist);

//Clear entire wishlist
router.delete("/", wishlistController.clearWishlist);

//Check if product is in wishlist
router.get("/check/:productId", wishlistController.checkInWishlist);

module.exports = router;
