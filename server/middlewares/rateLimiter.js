// Rate Limiting Middleware
// Prevents brute force attacks and abuse on critical routes

const rateLimit = require("express-rate-limit");

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Don't rate limit health checks
    return req.path === "/health";
  },
});

// Auth limiter - stricter for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
});

// API limiter - moderate for API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: "Too many API requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Cart/Order operations - stricter
const cartOrderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: "Too many cart/order operations, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Checkout limiter - very strict
const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 requests per minute
  message: "Too many checkout attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
  cartOrderLimiter,
  checkoutLimiter,
};
