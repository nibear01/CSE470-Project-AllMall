require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");
const router = require("./routes/auth-router");
const productRoutes = require("./routes/product-routes"); 
const app = express();


const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

//Support JSON and file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//All routes
app.use("/api/auth", router);
app.use("/api/products", productRoutes); 

//Start server
const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
