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
  const url = "https://cse470-project-allmall.onrender.com";
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCartCount = useCallback(
    async (providedToken = token) => {
      if (!providedToken) {
        setTotalCartItem(0);
        return;
      }

      try {
        const response = await fetch(`${url}/api/cart/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${providedToken}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        const items = data?.cart?.items || [];
        const total = items.reduce(
          (sum, item) => sum + (item?.quantity || 0),
          0,
        );
        setTotalCartItem(total);
      } catch (error) {
        console.log(`Failed to refresh cart count ${error}`);
      }
    },
    [token, url],
  );

  //Store JWT & fetch user immediately
  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
    userAuthentication(serverToken);
    refreshCartCount(serverToken);
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
      const response = await fetch(`${url}/api/auth/user`, {
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
      refreshCartCount(token);
    } else {
      setLoading(false);
      setTotalCartItem(0);
    }
  }, [token, refreshCartCount]);

  const isLoggedIn = !!token;
  // console.log("Is Logged in:", isLoggedIn);
  // console.log("user:", user);

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/api/products`, {
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
  }, []);

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
        refreshCartCount,
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
