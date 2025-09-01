const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const Product = require("../models/product-model");
const mongoose = require("mongoose");

// ---------------------
// Create new order (client-side, unchanged)
// ---------------------
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zipCode,
      paymentMethod,
      notes,
    } = req.body;

    console.log("Received order data:", req.body);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !zipCode
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping information fields are required",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || !cart.items.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const subtotal = cart.items.reduce(
      (total, item) => total + item.priceAtAddition * item.quantity,
      0
    );
    const shippingFee = subtotal > 0 ? 60 : 0;
    const totalAmount = subtotal + shippingFee;

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.priceAtAddition,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        zipCode,
      },
      paymentMethod: paymentMethod || "cod",
      subtotal,
      shippingFee,
      totalAmount,
      notes: notes || "",
    });

    for (const item of cart.items) {
      if (item.product?._id) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    cart.items = [];
    await cart.save();
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate(
      "items.product",
      "name price imageUrl"
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ---------------------
// Get user's orders
// ---------------------
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };
    if (status && status !== "all") query.orderStatus = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate("items.product", "name price imageUrl");

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ---------------------
// Get single order
// ---------------------
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      query._id = orderId;
    } else {
      query.orderId = orderId;
    }
    query.user = userId;

    const order = await Order.findOne(query).populate(
      "items.product",
      "name price imageUrl"
    );

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ---------------------
// Update order status (admin)
// ---------------------
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(orderId)) query._id = orderId;
    else query.orderId = orderId;

    const order = await Order.findOne(query);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    const populatedOrder = await Order.findById(order._id).populate(
      "items.product",
      "name price imageUrl"
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ---------------------
// Cancel order (user)
// ---------------------
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(orderId)) query._id = orderId;
    else query.orderId = orderId;
    query.user = userId;

    const order = await Order.findOne(query);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// ---------------------
// Get all orders (admin) 
// ---------------------
const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders for admin...");
    
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const { status, paymentStatus, search } = req.query;

    // Build query object
    const query = {};
    
    if (status && status !== "all") {
      query.orderStatus = status;
    }
    
    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus;
    }

    if (search?.trim()) {
      query.$or = [
        { orderId: { $regex: search.trim(), $options: "i" } },
        { "shippingAddress.email": { $regex: search.trim(), $options: "i" } },
        { "shippingAddress.firstName": { $regex: search.trim(), $options: "i" } },
        { "shippingAddress.lastName": { $regex: search.trim(), $options: "i" } },
      ];
    }

    // console.log("Query:", query);

    // Fetch orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "username email")
      .populate("items.product", "name price imageUrl");

    const totalOrders = await Order.countDocuments(query);

    console.log(`Found ${orders.length} orders out of ${totalOrders} total`);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1,
        limit,
      },
    });

  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
