# Backend Security Implementation - Next Steps

## ⚠️ IMPORTANT: Install Required Package

### Step 1: Install express-rate-limit

```bash
cd server
npm install express-rate-limit
```

This package is required for rate limiting functionality.

### Step 2: Verify Installation

```bash
npm list express-rate-limit
# Should show: express-rate-limit@6.x.x or higher
```

---

## 🔧 Complete Setup Checklist

### Backend Setup

- [ ] Install `express-rate-limit`: `npm install express-rate-limit`
- [ ] Add to `.env`:
  ```env
  JWT_TOKEN=your-secret-jwt-key
  REFRESH_TOKEN_SECRET=your-refresh-secret-key
  CORS_ORIGIN=http://localhost:5173,http://localhost:5174
  ```
- [ ] Verify all files exist:
  - [ ] `middlewares/xssProtection.js`
  - [ ] `middlewares/rateLimiter.js`
  - [ ] `middlewares/tokenUtils.js`
  - [ ] Updated `server.js`
  - [ ] Updated `models/user-model.js`
  - [ ] Updated `controllers/auth-controller.js`
  - [ ] Updated `routes/auth-router.js`
  - [ ] Updated `middlewares/authenticate.js`

### Testing

- [ ] Run health check: `curl http://localhost:5000/health`
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test token refresh endpoint
- [ ] Test rate limiting (attempt login 10 times)
- [ ] Test XSS protection (submit HTML in form)
- [ ] Test graceful shutdown (Ctrl+C and verify DB closes)

### Frontend Integration

- [ ] Read `FRONTEND_TOKEN_INTEGRATION.md`
- [ ] Update Auth context with new token system
- [ ] Implement `apiCall` method with auto-refresh
- [ ] Update login/register components
- [ ] Add error handling for token expiry
- [ ] Test token refresh flow
- [ ] Test logout functionality

### Documentation

- [ ] Review `SECURITY_GUIDE.md` for detailed explanations
- [ ] Review `IMPLEMENTATION_SUMMARY.md` for overview
- [ ] Share docs with team
- [ ] Update API documentation

---

## 📦 Updated Dependencies

### Current server/package.json should have:

```json
{
  "dependencies": {
    "express": "^4.x.x",
    "express-rate-limit": "^6.x.x", // ← NEW
    "mongoose": "^7.x.x",
    "jsonwebtoken": "^9.x.x",
    "bcrypt": "^5.x.x",
    "cors": "^2.x.x",
    "dotenv": "^16.x.x",
    "multer": "^1.x.x"
  }
}
```

---

## 🚀 Quick Start Commands

### Install and Run Backend

```bash
cd server
npm install express-rate-limit
npm start
# Should see: 🚀 Server running on http://localhost:5000
```

### Test Rate Limiting

```bash
# This should be rate limited after 5 attempts
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "\n Attempt $i completed"
done
```

### Test Token Refresh

```bash
# 1. Login to get tokens
TOKEN_RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}')

# 2. Extract tokens
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.refreshToken')

# 3. Refresh the token
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

---

## 🔐 Security Checklist

### Production Requirements

- [ ] Change `JWT_TOKEN` and `REFRESH_TOKEN_SECRET` to strong random strings
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to your production domain
- [ ] Use environment variables from secure manager (not .env)
- [ ] Enable database authentication
- [ ] Set up database backups
- [ ] Monitor rate limit usage
- [ ] Enable logging and monitoring
- [ ] Test graceful shutdown in production

### Local Development

- [ ] Keep debug logging enabled
- [ ] Use weak secrets for testing (or strong ones)
- [ ] Test with `NODE_ENV=development`
- [ ] Clear tokens and test re-login flow
- [ ] Test with expired tokens
- [ ] Test rate limiting

---

## 📝 Environment Variables Example

```env
# .env file (KEEP THIS SECRET - don't commit to git)

# Database
MONGO_URI=mongodb://localhost:27017/allmall

# JWT Configuration
JWT_TOKEN=your-super-secret-jwt-key-change-this-in-production-123456789
REFRESH_TOKEN_SECRET=your-refresh-secret-key-change-this-too-987654321

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Optional
DEBUG=true
LOG_LEVEL=debug
```

---

## ❌ Common Issues & Solutions

### Issue: "express-rate-limit not found"

```
Solution: npm install express-rate-limit
```

### Issue: "REFRESH_TOKEN_SECRET is undefined"

```
Solution: Add to .env file:
REFRESH_TOKEN_SECRET=your-secret-key
```

### Issue: "Cannot set token on undefined user"

```
Solution: Ensure user is created before calling generateRefreshToken()
```

### Issue: "Rate limit not working"

```
Solution:
1. Check that rateLimiter middleware is imported
2. Verify it's applied before routes
3. Check that rate limiter version is 6.x or higher
```

### Issue: "XSS protection too strict"

```
Solution:
1. Review xssProtection.js sanitizeInput function
2. Adjust escape rules if needed for your data
3. Consider allowing certain HTML if necessary
```

### Issue: "Database not closing on shutdown"

```
Solution:
1. Check for open connections holding references
2. Verify mongoose.connection.close() is being called
3. Check server.js graceful shutdown code
4. Ensure no middleware is keeping connections open
```

---

## 🧪 Verification Tests

After setup, run these tests to verify everything works:

### 1. Health Check

```bash
curl http://localhost:5000/health
# Expected: {"status":"Server is running"}
```

### 2. Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "phone":"1234567890",
    "password":"testpass123"
  }'
# Expected: success: true, accessToken, refreshToken
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
# Expected: success: true, accessToken, refreshToken
```

### 4. Protected Route

```bash
curl http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
# Expected: userData object
```

### 5. Token Refresh

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<YOUR_REFRESH_TOKEN>"}'
# Expected: new accessToken and refreshToken
```

### 6. Rate Limiting (Run 10 times quickly)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'
# After 5 attempts: Status 429 Too Many Requests
```

### 7. Graceful Shutdown

```bash
# 1. Start server: npm start
# 2. Press Ctrl+C
# Expected output:
# SIGINT received. Shutting down gracefully...
# HTTP server closed
# ✅ Database connection closed successfully
```

---

## 📚 Documentation Files Created

1. **SECURITY_GUIDE.md** - Complete security documentation
   - Token system explanation
   - XSS protection details
   - Rate limiting rules
   - Graceful shutdown flow
   - Best practices

2. **IMPLEMENTATION_SUMMARY.md** - Implementation overview
   - What was implemented
   - File structure
   - Testing checklist
   - Monitoring guide

3. **FRONTEND_TOKEN_INTEGRATION.md** - Frontend integration guide
   - Auth context update
   - API call implementation
   - Protected routes
   - Error handling
   - Login/logout examples

---

## ✅ Final Verification

Run this to verify all files exist:

```bash
# Check middleware files
ls -la server/middlewares/xssProtection.js
ls -la server/middlewares/rateLimiter.js
ls -la server/middlewares/tokenUtils.js

# Check documentation
ls -la server/SECURITY_GUIDE.md
ls -la server/IMPLEMENTATION_SUMMARY.md
ls -la client/FRONTEND_TOKEN_INTEGRATION.md
```

All should exist! ✅

---

## 🎉 You're All Set!

Your backend is now:
✅ Secure with JWT token system
✅ Protected from XSS attacks
✅ Rate limited to prevent abuse
✅ Gracefully shuts down
✅ Production-ready

**Next: Update your frontend with the new token system!**

See: `FRONTEND_TOKEN_INTEGRATION.md`
