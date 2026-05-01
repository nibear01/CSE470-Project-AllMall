# Frontend Token Integration Guide

## Overview

This guide explains how to integrate the new JWT token system (Access + Refresh tokens) in your React frontend.

---

## 1. Update Your Authentication Store

Update your `Auth.jsx` store to handle both tokens:

```jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken"),
  );
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [url] = useState("http://localhost:5000");

  // Register
  const register = async (formData) => {
    try {
      const response = await fetch(`${url}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);

        return { success: true, message: "Registration successful" };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);

        return { success: true, message: "Login successful" };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${url}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        // Update tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return true;
      }

      // If refresh fails, clear tokens and redirect to login
      logout();
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        await fetch(`${url}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  // API Call with Auto Token Refresh
  const apiCall = async (endpoint, options = {}) => {
    let token = localStorage.getItem("accessToken");

    // Make request with current token
    let response = await fetch(`${url}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      const data = await response.json();

      if (data.code === "TOKEN_EXPIRED") {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          token = localStorage.getItem("accessToken");

          // Retry request with new token
          response = await fetch(`${url}${endpoint}`, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }
    }

    return response;
  };

  // Fetch user data with token
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await apiCall("/api/auth/user");

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const value = {
    register,
    login,
    logout,
    refreshAccessToken,
    apiCall,
    user,
    accessToken,
    refreshToken,
    products,
    setProducts,
    url,
    isLoggedIn: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
```

---

## 2. Protected Routes Component

Create a protected route component that checks token expiry:

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/Auth";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

Use it in your router:

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/cart"
    element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## 3. API Calls with Auto Token Refresh

Instead of using regular `fetch`, use the `apiCall` method from context:

### Before (Old Way)

```jsx
const response = await fetch(`${url}/api/cart`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

### After (New Way)

```jsx
const { apiCall } = useAuth();

const response = await apiCall("/api/cart", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

The `apiCall` method:

- Automatically adds the access token
- Detects when token expires (401 response)
- Automatically refreshes the token
- Retries the original request
- Logs out if refresh fails

---

## 4. Example: Add to Cart with Auto Refresh

```jsx
import { useAuth } from "../Store/Auth";
import axios from "axios";
import { toast } from "react-toastify";

export const ProductItem = ({ product }) => {
  const { apiCall, url } = useAuth();

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();

    try {
      const response = await apiCall("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        toast.success("Product added to cart!");
      } else if (response.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Error adding to cart");
    }
  };

  return (
    <button onClick={(e) => handleAddToCart(e, product._id)}>
      Add to Cart
    </button>
  );
};
```

---

## 5. Error Handling Guide

### Handle Different Error Scenarios

```jsx
const handleApiError = (error, response) => {
  // Token expired - will auto refresh and retry
  if (response?.status === 401 && error?.code === "TOKEN_EXPIRED") {
    // apiCall handles this automatically
    return;
  }

  // Unauthorized - user not logged in
  if (response?.status === 401) {
    toast.error("Please login first");
    // Redirect to login
    return;
  }

  // Rate limited
  if (response?.status === 429) {
    toast.error("Too many requests. Please try again later.");
    return;
  }

  // Server error
  if (response?.status >= 500) {
    toast.error("Server error. Please try again later.");
    return;
  }

  // Generic error
  toast.error(error?.message || "An error occurred");
};
```

---

## 6. Login/Register Flow

### Register Page

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import { toast } from "react-toastify";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const result = await register(formData);

    if (result.success) {
      toast.success("Registration successful!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};
```

### Login Page

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import { toast } from "react-toastify";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 7. Logout Implementation

```jsx
import { useAuth } from "../Store/Auth";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

---

## 8. Token Storage Best Practices

### Recommended: Use HttpOnly Cookies (Most Secure)

```jsx
// Backend would set cookies with HttpOnly flag
// Frontend doesn't need to manage storage

// Fetch with credentials
const response = await fetch(`${url}/api/auth/login`, {
  method: "POST",
  credentials: "include", // Include cookies
  body: JSON.stringify(credentials),
});
```

### Alternative: Secure LocalStorage

```jsx
// Only store access token in localStorage
// Refresh token can be in secure HTTP-only cookie

localStorage.setItem("accessToken", token);

// Always include in requests
const response = await fetch(endpoint, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
```

### Never Do This

```jsx
// ❌ Don't store sensitive data in localStorage unencrypted
localStorage.setItem("password", password); // NEVER!

// ❌ Don't expose tokens in URLs
`/api/endpoint?token=${token}`; // NEVER!

// ❌ Don't log tokens
console.log(token); // ONLY in development
```

---

## Summary

✅ Implement the new Auth context with token management  
✅ Use `apiCall` for all API requests  
✅ Handle token expiry automatically  
✅ Implement protected routes  
✅ Store tokens securely (HttpOnly cookies preferred)  
✅ Add proper error handling  
✅ Clear tokens on logout

Your frontend is now fully integrated with the new security system! 🔒
