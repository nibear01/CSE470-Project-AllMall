import { useState } from "react";
import { useContext, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUsername] = useState(localStorage.getItem("userId"));

  //storing JWT
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };
  //username data store
  const setUserName = (name) => {
    setUsername(name);
    return localStorage.setItem("userId", name)
  };

  //logout
  const logoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    return;
  };

  const name = userName;
  let isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, storeTokenInLS, logoutUser, setUserName, name }}
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
