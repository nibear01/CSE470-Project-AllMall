const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");
const authenticateUser = require("../middlewares/authenticate");
const adminAuth = require("../middlewares/adminAuth");

// Add test route BEFORE authentication
router.get("/test", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Orders endpoint is working!",
    timestamp: new Date().toISOString()
  });
});

// Then apply authentication to all other routes
router.use(authenticateUser);

router.post("/", orderController.createOrder);
router.get("/my-orders", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrder);
router.patch("/:orderId/cancel", orderController.cancelOrder);

// Admin routes
router.get("/admin/allorders", adminAuth, orderController.getAllOrders);
router.patch("/admin/:orderId/status", adminAuth, orderController.updateOrderStatus);

module.exports = router;