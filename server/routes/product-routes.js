const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product-controller");
const upload = require("../config/multer"); 

router.get("/", productControllers.getProducts);
router.get("/:id", productControllers.getProductById);
router.post("/", upload.single("image"), productControllers.createProduct);
router.put("/:id", upload.single("image"), productControllers.updateProduct);
router.delete("/:id", productControllers.deleteProduct);

module.exports = router;