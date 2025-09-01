/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import { useState, useEffect } from "react";
import { FiUpload, FiX, FiUser } from "react-icons/fi";
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
      const imageUrl = `${url}${user.image}`;
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

      // console.log("Sending data:", {
      //   username: formData.username,
      //   email: formData.email,
      //   phone: formData.phone,
      //   description: formData.description,
      //   hasImage: formData.image instanceof File,
      // });

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
      // console.log(updatedUser.user);

      setUser(updatedUser.user);
      // console.log(user);

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
    <div className="!min-h-[80vh] !flex !justify-center !items-center !bg-gradient-to-br !from-emerald-50 !to-blue-100 !p-4">
      <div className="!w-full !max-w-md !bg-white !rounded-[4px] !shadow-2xl !overflow-hidden !p-6">
        <h2 className="!text-2xl !font-bold !text-center !mb-6 !text-gray-700">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="!space-y-4">
          {/* Image Upload */}
          <div className="!flex !flex-col !items-center !mb-4">
            <div className="!relative !group !mb-3">
              <div className="!h-32 !w-32 !rounded-full !overflow-hidden !border-4 !border-white !shadow-lg">
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
                      className="!absolute !top-1 !right-1 !bg-red-500 !text-white !rounded-full !p-1 !hover:bg-red-600"
                    >
                      <FiX className="!text-sm" />
                    </button>
                  </>
                ) : (
                  <div className="!h-full !w-full !bg-gray-200 !flex !items-center !justify-center">
                    <FiUser className="!text-4xl !text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <label
              className="!inline-flex !items-center !gap-2 !px-3 !py-1 !bg-emerald-500 border !text-white !rounded-[5px] 
            !cursor-pointer !hover:bg-white hover:!text-emerald-500 hover:!border-emerald-500 hover:!bg-white transition-all"
            >
              <FiUpload />
              {previewImage ? "Change Image" : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                className="!hidden "
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Username */}
          <div>
            <label className="!block !text-gray-700 !font-medium !mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-[3px] !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="!block !text-gray-700 !font-medium !mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-[3px] !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="!block !text-gray-700 !font-medium !mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-[3px] !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="!block !text-gray-700 !font-medium !mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-[3px] !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="!flex !justify-center !gap-4 !pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="!px-6 !py-2 !bg-gray-300 !text-gray-800 !font-medium !rounded-[3px] hover:!bg-gray-400 "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="!px-6 !py-2 !bg-emerald-500 !text-white !font-medium !rounded-[3px] border hover:!bg-white
               hover:!text-emerald-500 transition-all hover:!border-emerald-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
