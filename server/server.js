require("dotenv").config({ override: true });
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const connectDb = require("./config/db");
const router = require("./routes/auth-router");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/cart-routes");
const wishlistRoutes = require("./routes/wishlist-routes");
const orderRoutes = require("./routes/order-routes");
const chatbot = require("./routes/chatbotRoutes");
const morgan = require("morgan");
app.use(morgan("dev"));
const xssProtection = require("./middlewares/xssProtection");
const {
  generalLimiter,
  authLimiter,
  apiLimiter,
  cartOrderLimiter,
} = require("./middlewares/rateLimiter");

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Security Middleware - XSS Protection
app.use(xssProtection);

// Body Parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// General rate limiting
app.use(generalLimiter);

// Routes with specific rate limiters
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", router);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/cart", cartOrderLimiter, cartRoutes);
app.use("/api/wishlist", apiLimiter, wishlistRoutes);
app.use("/api/orders", cartOrderLimiter, orderRoutes);
app.use("/api/chatbot", apiLimiter, chatbot);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

let server;

// Database connection and server start
connectDb()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

// Graceful Shutdown Handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  // Stop accepting new requests
  if (server) {
    server.close(async () => {
      console.log("HTTP server closed");

      try {
        // Close database connection
        await mongoose.connection.close();
        console.log("✅ Database connection closed successfully");
      } catch (error) {
        console.error("Error closing database connection:", error);
      }

      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("❌ Forced shutdown: Server took too long to close");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
