/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import {
  useEffect,
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const url = "http://localhost:5000";
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [loading, setLoading] = useState(true);

  //Store JWT & fetch user immediately
  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
    userAuthentication(serverToken);
  };

  //Logout a user
  const logoutUser = useCallback(() => {
    setToken("");
    setUser(null);
    setTotalCartItem(0);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  }, []);

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

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const productList = await response.json();
        setProducts(productList);
      }
    } catch (error) {
      console.log(`Unable to fetch products data, error ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        logoutUser,
        user,
        setUser,
        loading,
        products,
        totalCartItem,
        setTotalCartItem,
        url,
      }}
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
