# Backend Security Implementation Guide

## Overview

This document explains the complete security system implemented in the AllMall backend, including JWT token management, XSS protection, rate limiting, and graceful database shutdown.

---

## 1. JWT Token System (Access + Refresh Tokens)

### Implementation

The backend now uses a dual-token system for enhanced security:

#### Access Token

- **Duration**: 15 minutes
- **Type**: Short-lived token used for API authentication
- **Use**: Included in every API request header
- **Generated on**: Login/Register

#### Refresh Token

- **Duration**: 7 days
- **Type**: Long-lived token stored in database
- **Use**: To obtain new access tokens when they expire
- **Generated on**: Login/Register

### How to Use

#### Login/Register Response

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "userId": "...",
    "username": "...",
    "email": "...",
    "isAdmin": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Using Access Token for Requests

```
Authorization: Bearer <accessToken>
```

#### Refresh Token Endpoint

When access token expires, use the refresh token:

```
POST /api/auth/refresh-token
Body: {
  "refreshToken": "..."
}
```

Response:

```json
{
  "success": true,
  "accessToken": "newAccessToken...",
  "refreshToken": "newRefreshToken...",
  "user": {...}
}
```

#### Logout Endpoint

```
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

---

## 2. XSS Protection

### Implementation

- **File**: `middlewares/xssProtection.js`
- **Applied to**: All routes via global middleware

### Features

1. **Input Sanitization**
   - Removes dangerous HTML characters
   - Escapes special characters in strings
   - Sanitizes query parameters, body, and URL parameters

2. **Security Headers**
   - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
   - `X-Frame-Options: DENY` - Prevents clickjacking
   - `X-XSS-Protection: 1; mode=block` - Enables browser XSS protection
   - `Content-Security-Policy` - Controls resource loading

### Sanitization Process

```
Before: <script>alert('XSS')</script>
After:  &lt;script&gt;alert('XSS')&lt;/script&gt;
```

---

## 3. Rate Limiting

### Implementation

- **File**: `middlewares/rateLimiter.js`
- **Library**: `express-rate-limit`

### Rate Limits by Route

| Route Type               | Limit      | Window | Purpose                 |
| ------------------------ | ---------- | ------ | ----------------------- |
| General                  | 100 req/IP | 15 min | Global rate limit       |
| Auth (Login/Register)    | 5 req/IP   | 15 min | Prevent brute force     |
| API (Products, Wishlist) | 30 req/IP  | 1 min  | Standard API protection |
| Cart/Orders              | 10 req/IP  | 1 min  | Prevent abuse           |
| Checkout                 | 3 req/IP   | 1 min  | Very strict             |

### Applied Routes

```javascript
// Auth routes (login/register)
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Standard API routes
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/wishlist", apiLimiter, wishlistRoutes);

// Critical operations
app.use("/api/cart", cartOrderLimiter, cartRoutes);
app.use("/api/orders", cartOrderLimiter, orderRoutes);
```

---

## 4. Graceful Database Shutdown

### Implementation

- **File**: `server.js` - Graceful shutdown handler

### Features

1. **Graceful Connection Closure**
   - Server stops accepting new requests
   - Existing requests complete
   - Database connection closes safely

2. **Timeout Protection**
   - Force shutdown after 10 seconds
   - Prevents zombie processes

3. **Signal Handling**
   - Catches `SIGTERM` and `SIGINT`
   - Proper cleanup before exit

### Process Exit Flow

```
Signal Received (CTRL+C, docker stop, etc.)
    ↓
Stop accepting new requests
    ↓
Allow existing requests to complete
    ↓
Close HTTP server
    ↓
Close database connection
    ↓
Exit process (code 0)
```

### Error Handling

- **Uncaught Exceptions**: Force exit with code 1
- **Unhandled Promise Rejections**: Force exit with code 1
- **Graceful Failure**: Timeout force exit with code 1

---

## 5. Middleware Stack

### Order of Execution

```
1. CORS middleware
2. XSS Protection middleware ← Security
3. Body parser middleware
4. Static file middleware
5. Rate limiter middleware ← Security
6. Route handlers with authentication ← Security
```

---

## 6. Environment Variables Required

Add these to your `.env` file:

```env
# Database
MONGO_URI=mongodb://localhost:27017/allmall

# JWT Tokens
JWT_TOKEN=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-key

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=["http://localhost:5173", "http://localhost:5174"]
```

---

## 7. Authentication Flow

### Login/Register Flow

```
User submits credentials
    ↓
Hash password (bcrypt)
    ↓
Create/Find user in DB
    ↓
Generate Access Token (15m)
    ↓
Generate Refresh Token (7d) → Store in DB
    ↓
Send both tokens to client
```

### Authenticated Request Flow

```
Client includes: Authorization: Bearer <accessToken>
    ↓
Middleware extracts token
    ↓
Verify signature and expiry
    ↓
Check token type (must be 'access')
    ↓
Fetch user from DB
    ↓
Attach user to req.user
    ↓
Call next() to proceed
```

### Token Refresh Flow

```
Access token expires
    ↓
Client sends refresh token to /api/auth/refresh-token
    ↓
Middleware verifies refresh token
    ↓
Check if token matches DB stored token
    ↓
Generate new access token (15m)
    ↓
Optionally rotate refresh token (7d)
    ↓
Send new tokens to client
```

---

## 8. Security Best Practices

### For Frontend Developers

1. **Store Tokens Safely**
   - Use HttpOnly cookies (recommended)
   - Or secure localStorage with proper handling

2. **Token Handling**
   - Always include access token in Authorization header
   - Automatically refresh when token expires (401 response)
   - Clear tokens on logout

3. **Error Handling**
   - Handle `TOKEN_EXPIRED` error code
   - Redirect to login on `401` responses
   - Implement retry logic with refresh tokens

### For Backend Developers

1. **Never**
   - Send refresh token in response body (use cookies)
   - Expose JWT secret keys
   - Skip XSS sanitization
   - Disable rate limiting on critical routes

2. **Always**
   - Use HTTPS in production
   - Rotate secrets periodically
   - Monitor failed authentication attempts
   - Log security events

---

## 9. Testing the Security System

### Test Brute Force Protection

```bash
# Should be rate limited after 5 attempts
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Test XSS Protection

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>","email":"test@test.com","phone":"123","password":"pass"}'
```

### Test Token Expiry

```bash
# Get access token from login
# Wait 15 minutes
# Try to use it - should fail with TOKEN_EXPIRED
```

---

## 10. Monitoring and Debugging

### Check Server Health

```bash
curl http://localhost:5000/health
# Response: {"status": "Server is running"}
```

### View Rate Limit Headers

```bash
curl -I http://localhost:5000/api/products
# Look for: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
```

### Enable Debug Logging

```
NODE_ENV=development npm start
```

---

## Summary

| Feature                | Status         | File                                              |
| ---------------------- | -------------- | ------------------------------------------------- |
| Access/Refresh Tokens  | ✅ Implemented | models/user-model.js, middlewares/authenticate.js |
| XSS Protection         | ✅ Implemented | middlewares/xssProtection.js                      |
| Rate Limiting          | ✅ Implemented | middlewares/rateLimiter.js                        |
| Graceful Shutdown      | ✅ Implemented | server.js                                         |
| Token Refresh Endpoint | ✅ Implemented | routes/auth-router.js                             |
| Logout Endpoint        | ✅ Implemented | routes/auth-router.js                             |
| Security Headers       | ✅ Implemented | middlewares/xssProtection.js                      |
| Error Handling         | ✅ Implemented | server.js                                         |

All security features are production-ready! 🔒
