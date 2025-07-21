import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";
import { useAuth } from "../../Store/Auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("response data: ", response)
        const res_data = await response.json();
        console.log("res_data: ",res_data);
        
        storeTokenInLS(res_data.token);

        navigate("/");
      } else {
        setError("Invalid Credentials! Please try again.");
      }
    } catch (error) {
      console.log("Login: ", error);
    }
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-[5px] shadow-xl !pb-10 !h-auto w-[350px] max-w-md">
        <div className="text-center !p-6 !mt-3 !min-h-22 h-auto">
          <h2 className="text-3xl font-bold text-gray-800 !mb-3">
            Welcome to AllMall
          </h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4 !min-h-40 h-auto !m-3"
        >
          {error && (
            <div className="h-10 !py-2 !my-4 text-center bg-red-100 border border-red-300 text-red-700 px-4 rounded text-sm">
              {error}
            </div>
          )}
          {/* <div className="h-7 !py-4 !my-4 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
              {error}
            </div> */}

          {/* Email Input */}
          <div className="relative !mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full !p-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full !p-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute  right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full !py-2 !mt-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-sm !min-h-[15] h-auto text-center text-gray-500">
          Don't have an account?
          <Link to="/register" className="text-emerald-600 cursor-pointer">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
