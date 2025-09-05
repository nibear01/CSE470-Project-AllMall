const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const Cart = require("../models/cart-model");
const Wishlist = require("../models/wishlist-model");
const Product = require("../models/product-model");
const Order = require("../models/order-model");
const User = require("../models/user-model");

/**
 * Chatbot controller with enhanced functionality
 * Expects JSON: { input: "user message" }
 */
const chatWithBot = async (req, res) => {
  const userInput = req.body.input;
  const userId = req.user?.userId;

  if (!userInput || userInput.trim() === "") {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const lowerInput = userInput.toLowerCase();
    let userData = {};
    let cartData = {};
    let wishlistData = {};
    let orderData = {};

    if (userId) {
      const user = await User.findById(userId).select("-password");
      if (user) userData = user.toObject();

      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
        "name price imageUrl stock"
      );
      if (cart) cartData = cart.toObject();
      const wishlist = await Wishlist.findOne({ user: userId }).populate(
        "items.product",
        "name price imageUrl"
      );
      if (wishlist) wishlistData = wishlist.toObject();

      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("items.product", "name imageUrl");
      if (orders.length > 0) orderData = orders;
    }

    if (userId) {
      if (
        lowerInput.includes("cart") ||
        lowerInput.includes("shopping cart") ||
        lowerInput.includes("what's in my cart") ||
        lowerInput.includes("cart items")
      ) {
        if (!cartData.items || cartData.items.length === 0) {
          return res.json({
            reply:
              "Your cart is currently empty. Would you like to browse some products to add to your cart?",
          });
        }

        const cartSummary = cartData.items
          .map(
            (item) =>
              `${item.quantity}x ${item.product?.name || "Product"} - $${(
                item.priceAtAddition * item.quantity
              ).toFixed(2)}`
          )
          .join("\n");

        const total = cartData.items.reduce(
          (sum, item) => sum + item.priceAtAddition * item.quantity,
          0
        );

        return res.json({
          reply: `Here's what's in your cart:\n${cartSummary}\n\nTotal: $${total.toFixed(
            2
          )}\n\nYou can proceed to checkout or continue shopping!`,
        });
      }

      if (
        lowerInput.includes("wishlist") ||
        lowerInput.includes("wish list") ||
        lowerInput.includes("saved items") ||
        lowerInput.includes("favorites")
      ) {
        if (!wishlistData.items || wishlistData.items.length === 0) {
          return res.json({
            reply:
              "Your wishlist is empty. You can save products you like by clicking the heart icon!",
          });
        }

        const wishlistSummary = wishlistData.items
          .map(
            (item, index) =>
              `${index + 1}. ${item.product?.name || "Product"} - $${
                item.product?.price?.toFixed(2) || "0.00"
              }`
          )
          .join("\n");

        return res.json({
          reply: `Here are your saved items:\n${wishlistSummary}\n\nYou have ${wishlistData.items.length} items in your wishlist.`,
        });
      }

      // Order-related queries
      if (
        lowerInput.includes("order") ||
        lowerInput.includes("orders") ||
        lowerInput.includes("my orders") ||
        lowerInput.includes("order status")
      ) {
        if (!orderData.length) {
          return res.json({
            reply:
              "You haven't placed any orders yet. Start shopping to see your orders here!",
          });
        }

        const orderSummary = orderData
          .map(
            (order) =>
              `Order #${order.orderId} - ${
                order.orderStatus
              } - Total: $${order.totalAmount.toFixed(2)}`
          )
          .join("\n");

        return res.json({
          reply: `Here are your recent orders:\n${orderSummary}\n\nYou can view all orders in your account section.`,
        });
      }

      // Product availability queries
      if (
        lowerInput.includes("stock") ||
        lowerInput.includes("available") ||
        lowerInput.includes("in stock") ||
        lowerInput.includes("out of stock")
      ) {
        // Extract product names from query
        const productNames = extractProductNames(userInput);

        if (productNames.length > 0) {
          const products = await Product.find({
            name: { $in: productNames.map((name) => new RegExp(name, "i")) },
            status: "active",
          }).select("name stock price");

          if (products.length > 0) {
            const stockInfo = products
              .map(
                (product) =>
                  `${product.name}: ${
                    product.stock > 0
                      ? `${product.stock} available - $${product.price.toFixed(
                          2
                        )}`
                      : "Out of stock"
                  }`
              )
              .join("\n");

            return res.json({
              reply: `Here's the availability information:\n${stockInfo}`,
            });
          } else {
            return res.json({
              reply:
                "I couldn't find those products in our catalog. Could you check the product names?",
            });
          }
        }
      }
    }

    // General product queries
    if (
      lowerInput.includes("product") ||
      lowerInput.includes("item") ||
      lowerInput.includes("find") ||
      lowerInput.includes("search")
    ) {
      const productNames = extractProductNames(userInput);
      if (productNames.length > 0) {
        const products = await Product.find({
          name: { $in: productNames.map((name) => new RegExp(name, "i")) },
          status: "active",
        }).select("name price imageUrl stock description");

        if (products.length > 0) {
          const productInfo = products
            .map(
              (product) =>
                `${product.name}: $${product.price.toFixed(2)} - ${
                  product.stock > 0 ? "In stock" : "Out of stock"
                }\nDescription: ${product.description.substring(0, 100)}...`
            )
            .join("\n\n");

          return res.json({
            reply: `I found these products:\n\n${productInfo}`,
          });
        }
      }
    }

    // Get the Gemini model for general queries
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Create enhanced prompt with user context
    const context = userId
      ? `
User Context:
- Name: ${userData.username || "Customer"}
- Email: ${userData.email || "Not provided"}
- Cart Items: ${cartData.items?.length || 0}
- Wishlist Items: ${wishlistData.items?.length || 0}
- Recent Orders: ${orderData.length || 0}
    `
      : "User is not logged in.";

    const prompt = `
You are AllMall, a helpful AI shopping assistant for AllMall, an e-commerce platform.
Your role is to assist customers with:
- Product recommendations and information
- Order status inquiries
- Shipping information
- Return policies
- Cart and wishlist management
- General shopping questions

${context}

Important: You have access to real-time data about the user's cart, wishlist, and orders.
If the user asks about their personal shopping data, provide accurate information based on the context above.

Be friendly, concise, and helpful. If you don't know something, politely say so.

Customer question: ${userInput}
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    res.json({ reply: botReply.trim() });
  } catch (err) {
    console.error("AI request failed:", err);
    res
      .status(500)
      .json({ error: "AI request failed. Please try again later." });
  }
};

// Helper function to extract product names from user input
function extractProductNames(input) {
  const words = input.toLowerCase().split(" ");
  const productKeywords = [
    "product",
    "item",
    "of",
    "the",
    "a",
    "an",
    "is",
    "are",
    "in",
    "stock",
    "available",
  ];

  return words.filter(
    (word) =>
      !productKeywords.includes(word) &&
      word.length > 2 &&
      !word.match(/^(what|where|when|how|why|is|are|can|do|does|my|your|our)$/)
  );
}

module.exports = { chatWithBot };
