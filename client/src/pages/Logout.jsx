import { useEffect } from "react";
import { useAuth } from "../Store/Auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();     
    navigate("/login");
  }, [logoutUser, navigate]);

  return null; // nothing to render
};

export default Logout;
