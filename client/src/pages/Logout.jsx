import { useEffect } from "react";
import { useAuth } from "../Store/Auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    navigate("/login", { replace: true }); 
  }, [logoutUser, navigate]);

  return null; 
};

export default Logout;
