import { Link } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import { FiEdit, FiMail, FiPhone, FiUser } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logoutUser, url } = useAuth();
  axios.defaults.baseURL = url;

  const handleDelete = async () => {
    toast.info(
      <div>
        Are you sure you want to delete your profile?
        <div className="!mt-2 !flex !gap-2 ">
          <button
            onClick={async () => {
              try {
                const deleteUser = await axios.delete(
                  `api/auth/user/${user._id}`
                );
                if (deleteUser.request.statusText === "OK") {
                  logoutUser();
                  toast.success("Profile deleted successfully!");
                } else {
                  toast.error("Failed to delete profile!");
                }
              } catch (error) {
                toast.error(`Can't delete profile: ${error.message}`);
              } finally {
                toast.dismiss(); // close the toast
              }
            }}
            className="!px-3 !py-1 !bg-red-500 !text-white !rounded-md"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="!px-3 !py-1 !bg-gray-300 !text-black !rounded-md"
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <div className="!min-h-[80vh] !flex !justify-center !items-center !bg-gradient-to-br !from-emerald-50 !to-blue-100 !p-4">
      <div className="!w-full !min-h-[60vh] !max-w-3xl !bg-white !rounded-[5px] !shadow-2xl !overflow-hidden !transition-all !duration-300 hover:!shadow-lg">
        {/* Profile Header */}
        <div className="!bg-emerald-500 !border !text-white !p-4 md:!p-6">
          <h1 className="!text-xl md:!text-2xl !font-bold">
            AllMall User Profile
          </h1>
          <p className="!text-emerald-100 !text-sm md:!text-base">
            Manage your account information
          </p>
        </div>

        {/* Profile Content */}
        <div className="!p-4 md:!p-6 lg:!p-8 !flex !flex-col md:!flex-row !gap-6">
          {/* Profile Picture */}
          <div className="!flex-shrink-0 !mx-auto md:!mx-0">
            <div className="!relative !group">
              <img
                src={
                  user?.image
                    ? `${url}${user.image}`
                    : "/src/assets/demo_user.png"
                }
                alt="Profile"
                className="!h-28 !w-28 sm:!h-32 sm:!w-32 md:!h-36 md:!w-36 lg:!h-40 lg:!w-40 !rounded-full !object-cover !border-4 !border-white !shadow-lg !transition-transform !duration-300 group-hover:!scale-105"
              />
              <div className="!absolute !inset-0 !bg-black !bg-opacity-20 !rounded-full !flex !items-center !justify-center !opacity-0 group-hover:!opacity-100 !transition-opacity !duration-300">
                <FiEdit className="!text-white !text-xl sm:!text-2xl" />
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="!flex-grow !space-y-3 md:!space-y-4">
            <div className="!space-y-1">
              <h2 className="!text-xl sm:!text-2xl !font-bold !text-gray-800 !flex !items-center !gap-2">
                <FiUser className="!text-emerald-600" />
                {user?.username || "Username"}
              </h2>
              <p className="!text-gray-500 !italic !text-xs sm:!text-sm">
                {user?.description || "No description provided"}
              </p>
            </div>

            <div className="!space-y-2 sm:!space-y-3">
              <div className="!flex !items-center !gap-2 sm:!gap-3 !text-sm sm:!text-base !text-gray-700">
                <FiMail className="!text-emerald-600 !flex-shrink-0" />
                <span>{user?.email || "No email provided"}</span>
              </div>

              <div className="!flex !items-center !gap-2 sm:!gap-3 !text-sm sm:!text-base !text-gray-700">
                <FiPhone className="!text-emerald-600 !flex-shrink-0" />
                <span>{user?.phone || "No phone number provided"}</span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex items-center gap-5 ">
              <div className="!pt-3 md:!pt-4">
                <Link
                  to={`/profile/edit/${user?._id}`}
                  className="!inline-flex !items-center !gap-2 !px-3 sm:!px-4 !py-1 !text-sm sm:!text-base !bg-emerald-500 !border !border-emerald-500 !text-white !font-medium 
                !rounded-[3px] !shadow-md hover:!shadow-lg !transition-all !duration-300 hover:!bg-white hover:!text-emerald-500 hover:!border-emerald-500"
                >
                  <FiEdit />
                  Edit Profile
                </Link>
              </div>
              <div className="!pt-3 md:!pt-4">
                <button
                  onClick={() => handleDelete()}
                  className="!inline-flex !items-center !gap-2 !px-3 sm:!px-4 !py-1 !text-sm sm:!text-base !bg-[#d20f0fd0] !border !border-[#d20f0fd0] !text-white !font-medium 
                !rounded-[3px] !shadow-md hover:!shadow-lg !transition-all !duration-300 hover:!bg-white hover:!text-[#d20f0fd0] hover:!border-[#d20f0fd0] cursor-pointer"
                >
                  <FiEdit />
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="!bg-gray-50 !px-4 md:!px-6 !py-3 md:!py-4 !h-full !border-t !border-gray-200 !flex !flex-col sm:!flex-row !justify-around !gap-2 sm:!gap-0">
          <div className="!text-center">
            <p className="!text-gray-500 !text-xs sm:!text-sm">Member Since</p>
            <p className="!font-semibold !text-sm sm:!text-base">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="!text-center">
            <p className="!text-gray-500 !text-xs sm:!text-sm">Last Updated</p>
            <p className="!font-semibold !text-sm sm:!text-base">
              {new Date(user?.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
