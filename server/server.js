require("dotenv").config({ override: true });
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");
const router = require("./routes/auth-router");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/cart-routes");
const wishlistRoutes = require("./routes/wishlist-routes");
const orderRoutes = require("./routes/order-routes");
const chatbot = require("./routes/chatbotRoutes");
const PORT = process.env.PORT || 5000;

// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://allmall.onrender.com"];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
//   credentials: true,
// };

app.use(cors());

//Support JSON and file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//All routes
app.use("/api/auth", router);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chatbot", chatbot);



connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
