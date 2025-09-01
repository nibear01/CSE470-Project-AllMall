const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart-controller");
const authenticateUser = require("../middlewares/authenticate");

router.use(authenticateUser)

// Protected routes (require authentication)
router.post("/", cartController.addToCart);
router.get("/", cartController.getCart);
router.patch("/:itemId", cartController.updateCartItem);
router.delete("/:itemId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

module.exports = router;
