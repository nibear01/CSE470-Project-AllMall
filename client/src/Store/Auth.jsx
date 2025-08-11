/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, useContext, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // null means "not loaded yet"
  const [loading, setLoading] = useState(true);

  // Store JWT & fetch user immediately
  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
    userAuthentication(serverToken); // fetch right away
  };

  const logoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const userAuthentication = async (providedToken = token) => {
    if (!providedToken) return;
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${providedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("user data in auth:", data.userData);
        setUser(data.userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(`Failed to fetch user data ${error}`);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
    } else {
      setLoading(false);
    }
  }, [token]);

  const isLoggedIn = !!token;
  // console.log("Is Logged in:", isLoggedIn);
  // console.log("user:", user);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, storeTokenInLS, logoutUser, user, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the provider");
  }
  return authContextValue;
};
