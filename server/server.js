require("dotenv").config({ override: true });
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/auth-router");
const connectDb = require("./config/db");

//tackle cors
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT , DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", router);

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
