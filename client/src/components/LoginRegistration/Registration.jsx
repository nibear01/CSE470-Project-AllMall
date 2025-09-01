import React, { useState } from "react";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Store/Auth";

const Registration = () => {
  const { url } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${url}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ username: "", email: "", phone: "", password: "" });
        toast.success("Registration successful! You can now login.");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.log("Register Error: ", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="!min-h-screen !bg-gradient-to-br !from-emerald-50 !to-blue-100 !flex !items-center !justify-center !px-4 !py-12">
      <div className="!bg-white !rounded-xl !shadow-2xl !pb-8 !pt-6 !w-full !max-w-md !relative !overflow-hidden">
        {/* Decorative elements */}
        <div className="!absolute !-top-20 !-right-20 !w-40 !h-40 !bg-emerald-200 !rounded-full !opacity-20"></div>
        <div className="!absolute !-bottom-20 !-left-20 !w-40 !h-40 !bg-blue-200 !rounded-full !opacity-20"></div>

        <div className="!relative !z-10 !text-center !px-8 !mb-6">
          <h2 className="!text-3xl !font-bold !text-gray-800 !mb-2 !tracking-tight">
            Join <span className="!text-emerald-600">AllMall</span>
          </h2>
          <p className="!text-sm !text-gray-500 !font-medium">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleRegister} className="!px-8 !space-y-5">
          {/* Username */}
          <div className="!space-y-1">
            <label className="!text-sm !font-medium !text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !outline-none !transition-all !duration-200"
              required
            />
          </div>

          {/* Email */}
          <div className="!space-y-1">
            <label className="!text-sm !font-medium !text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !outline-none !transition-all !duration-200"
              required
            />
          </div>

          {/* Phone */}
          <div className="!space-y-1">
            <label className="!text-sm !font-medium !text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+880 1234 567890"
              value={formData.phone}
              onChange={handleChange}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !outline-none !transition-all !duration-200"
              required
            />
          </div>

          {/* Password */}
          <div className="!space-y-1 !relative">
            <label className="!text-sm !font-medium !text-gray-700">
              Password
            </label>
            <div className="!relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="!w-full !p-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !outline-none !transition-all !duration-200 !pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="!absolute !right-3 !top-1/2 !transform !-translate-y-1/2 !text-gray-400 !hover:text-gray-600 !transition-colors"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`!w-full !py-3 !mt-2 !bg-gradient-to-r !from-emerald-500 !to-emerald-600 !text-white !rounded-lg !font-semibold !hover:from-emerald-600 !hover:to-emerald-700 !transition-all !duration-300 !shadow-md !hover:shadow-lg ${
              isLoading ? "!opacity-80 !cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="!flex !items-center !justify-center">
                <svg
                  className="!animate-spin !-ml-1 !mr-3 !h-5 !w-5 !text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="!opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="!opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="!mt-6 !text-center !text-sm !text-gray-500 !px-8">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="!text-emerald-600 !font-medium !hover:text-emerald-800 !transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
