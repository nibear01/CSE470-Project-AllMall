import React, { useState } from "react";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";
import { useAuth } from "../../Store/Auth";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [registerSucces, setRegisterSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(response);

      if (response.ok) {
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        setRegisterSuccess("Registration Successful! Please Login.");

        const res_data = await response.json();
        storeTokenInLS(res_data.token);

        // navigate("/login")
      } else {
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        setError("Invalid Registration! Please try again");
      }
    } catch (error) {
      console.log("Register: ", error);
    }
  };

  useEffect(() => {
    let errorTimer, successTimer;

    if (error) {
      errorTimer = setTimeout(() => {
        setError("");
      }, 5000);
    }

    if (registerSucces) {
      successTimer = setTimeout(() => {
        setRegisterSuccess("");
      }, 5000);
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(successTimer);
    };
  }, [error, registerSucces]);

  return (
    <div className="min-h-[80vh] h-auto bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-[5px] shadow-xl !pb-10 !h-auto w-[350px] max-w-md">
        <div className="text-center !p-6 !mt-4 !min-h-22 !h-auto">
          <h2 className="text-3xl font-bold text-gray-800 !mb-3">
            Create Account
          </h2>
          <p className="text-sm text-gray-500">
            Join AllMall for the best experience
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 !h-auto !m-4">
          {error && (
            <div className="h-10 !py-2 !my-4 text-center bg-red-100 border border-red-300 text-red-700 px-4 rounded !text-sm">
              {error}
            </div>
          )}

          {registerSucces && (
            <div className="h-10 !py-2 !my-4 text-center bg-green-100 border border-green-300 text-green-700 px-4 rounded !text-sm">
              {registerSucces}
            </div>
          )}

          {/* Username */}
          <div className="relative !mb-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full !p-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative !mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full !p-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative !mb-4">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full !p-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full !p-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full !py-2 !mt-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center !h-auto text-gray-500">
          Already have an account?
          <Link to="/login" className="text-emerald-600 cursor-pointer">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
