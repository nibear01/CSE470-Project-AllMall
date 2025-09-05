/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import { useState, useEffect } from "react";
import { FiUpload, FiX, FiUser, FiMail, FiPhone, FiEdit3, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { user, setUser, token, url } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    description: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        description: user.description || "",
        image: user.image || "",
      });
      const imageUrl = user.image ? `${url}${user.image}` : "";
      setPreviewImage(imageUrl || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Add the file to formData
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const removeImage = () => {
    setPreviewImage("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("description", formData.description);

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `${url}/api/auth/update/user/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Backend error:", responseData);
        throw new Error(responseData.message || "Failed to update profile");
      }

      const updatedUser = responseData;
      setUser(updatedUser.user);

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Something went wrong while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="!min-h-screen !bg-gradient-to-br !from-gray-50 !to-gray-100 !py-8 !px-4 !sm:px-6 !lg:px-8">
      <div className="!max-w-4xl !mx-auto">
        {/* Header Section */}
        <div className="!text-center !mb-8">
          <button
            onClick={() => navigate(-1)}
            className="!inline-flex !items-center !gap-2 !text-emerald-600 !hover:text-emerald-700 !mb-4 !transition-colors"
          >
            <FiArrowLeft className="!text-lg" />
            Back to Profile
          </button>
          <h1 className="!text-3xl !sm:text-4xl !font-bold !text-gray-900 !mb-2">Edit Your Profile</h1>
          <p className="!text-gray-600 !text-lg">Update your personal information and preferences</p>
        </div>

        <div className="!bg-white !rounded-2xl !shadow-xl !overflow-hidden">
          <div className="!bg-gradient-to-r !from-emerald-500 !to-emerald-600 !p-6 !text-white">
            <h2 className="!text-xl !font-semibold">Profile Information</h2>
            <p className="!text-emerald-100">Update your account details and profile picture</p>
          </div>

          <form onSubmit={handleSubmit} className="!p-6 !lg:p-8">
            <div className="!grid !grid-cols-1 !lg:grid-cols-3 !gap-8">
              {/* Image Upload Section */}
              <div className="!lg:col-span-1">
                <div className="!flex !flex-col !items-center !text-center">
                  <div className="!relative !mb-4">
                    <div className="!h-40 !w-40 !rounded-full !overflow-hidden !border-4 !border-white !shadow-lg !mx-auto">
                      {previewImage ? (
                        <>
                          <img
                            src={previewImage}
                            alt="Profile preview"
                            className="!h-full !w-full !object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="!absolute !top-2 !right-2 !bg-red-500 !text-white !rounded-full !p-1.5 !hover:bg-red-600 !transition-colors !shadow-md"
                          >
                            <FiX className="!text-sm" />
                          </button>
                        </>
                      ) : (
                        <div className="!h-full !w-full !bg-gray-200 !flex !items-center !justify-center">
                          <FiUser className="!text-5xl !text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="!inline-flex !items-center !gap-2 !px-5 !py-2.5 !bg-emerald-500 !text-white !rounded-lg !font-medium 
                    !shadow-md hover:!shadow-lg !transition-all !duration-300 hover:!bg-emerald-600 !cursor-pointer">
                    <FiUpload />
                    {previewImage ? "Change Image" : "Upload Image"}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="!hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="!text-gray-500 !text-sm !mt-2">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="!lg:col-span-2 !space-y-6">
                {/* Username */}
                <div className="!space-y-2">
                  <label className="!text-sm !font-medium !text-gray-700 !flex !items-center !gap-2">
                    <FiUser className="!text-emerald-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="!w-full !px-4 !py-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 
                    !focus:border-emerald-500 !transition-colors !placeholder-gray-400"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                  />
                </div>

                {/* Email */}
                <div className="!space-y-2">
                  <label className="!text-sm !font-medium !text-gray-700 !flex !items-center !gap-2">
                    <FiMail className="!text-emerald-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="!w-full !px-4 !py-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 
                    !focus:border-emerald-500 !transition-colors !placeholder-gray-400"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone */}
                <div className="!space-y-2">
                  <label className="!text-sm !font-medium !text-gray-700 !flex !items-center !gap-2">
                    <FiPhone className="!text-emerald-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="!w-full !px-4 !py-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 
                    !focus:border-emerald-500 !transition-colors !placeholder-gray-400"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Description */}
                <div className="!space-y-2">
                  <label className="!text-sm !font-medium !text-gray-700 !flex !items-center !gap-2">
                    <FiEdit3 className="!text-emerald-600" />
                    Bio Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    className="!w-full !px-4 !py-3 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 
                    !focus:border-emerald-500 !transition-colors !placeholder-gray-400 !resize-none"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="!flex !flex-wrap !gap-4 !pt-6 !border-t !border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="!px-6 !py-3 !bg-gray-200 !text-gray-800 !font-medium !rounded-lg 
                    hover:!bg-gray-300 !transition-colors !flex-1 !sm:flex-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="!px-6 !py-3 !bg-emerald-500 !text-white !font-medium !rounded-lg 
                    hover:!bg-emerald-600 !disabled:opacity-50 !disabled:cursor-not-allowed !transition-colors 
                    !flex-1 !sm:flex-none !flex !items-center !justify-center !gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="!w-4 !h-4 !border-2 !border-white !border-t-transparent !rounded-full !animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;