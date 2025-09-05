import { Link } from "react-router-dom";
import { useAuth } from "../Store/Auth";
import {
  FiEdit,
  FiMail,
  FiPhone,
  FiUser,
  FiShoppingBag,
  FiCalendar,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logoutUser, url } = useAuth();
  axios.defaults.baseURL = url;

  const handleDelete = async () => {
    toast.info(
      <div className="!p-4">
        <h3 className="!text-lg !font-semibold !text-gray-800 !mb-3">
          Confirm Account Deletion
        </h3>
        <p className="!text-gray-600 !mb-4">
          Are you sure you want to permanently delete your account? This action
          cannot be undone.
        </p>
        <div className="!flex !gap-2 !justify-end">
          <button
            onClick={() => toast.dismiss()}
            className="!px-4 !py-2 !bg-gray-200 !text-gray-800  !rounded-lg !hover:bg-gray-300 !transition-colors !font-[6px]"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                const deleteUser = await axios.delete(
                  `api/auth/user/${user._id}`
                );
                if (deleteUser.request.statusText === "OK") {
                  logoutUser();
                  toast.success("Account deleted successfully!");
                } else {
                  toast.error("Failed to delete account!");
                }
              } catch (error) {
                toast.error(`Cannot delete account: ${error.message}`);
              } finally {
                toast.dismiss();
              }
            }}
            className="!px-4 !py-2 !bg-red-600 !text-white !rounded-lg !hover:bg-red-700 !transition-colors !font-[6px]"
          >
            Delete Account
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: "!rounded-xl !shadow-xl",
      }
    );
  };

  return (
    <div className="!min-h-screen !bg-gradient-to-br !from-gray-50 !to-gray-100 !py-8 !px-4 !sm:px-6 !lg:px-8">
      <div className="!max-w-6xl !mx-auto">
        {/* Header Section */}
        <div className="!text-center !mb-8">
          <h1 className="!text-3xl !sm:text-4xl !font-bold !text-gray-900 !mb-2">
            My Account Dashboard
          </h1>
          <p className="!text-gray-600 !text-lg">
            Manage your profile and account settings
          </p>
        </div>

        <div className="!grid !grid-cols-1 !lg:grid-cols-3 !gap-8">
          {/* Sidebar Navigation */}
          <div className="!bg-white !rounded-2xl !shadow-lg !p-6 !h-fit !lg:sticky !lg:top-8">
            <div className="!text-center !mb-6">
              <div className="!relative !inline-block !mb-4">
                <img
                  src={
                    user?.image
                      ? `${url}${user.image}`
                      : "/src/assets/demo_user.png"
                  }
                  alt="Profile"
                  className="!h-24 !w-24 !rounded-full !object-cover !border-4 !border-white !shadow-lg !mx-auto"
                />
              </div>
              <h2 className="!text-xl !font-semibold !text-gray-800">
                {user?.username || "Username"}
              </h2>
              <p className="!text-gray-500 !text-sm">
                {user?.email || "No email provided"}
              </p>
            </div>

            <nav className="!space-y-2">
              <Link
                to="#"
                className="!flex !items-center !gap-3 !p-3 !bg-emerald-50 !text-emerald-700 !rounded-lg !font-medium"
              >
                <FiUser className="!text-emerald-600" />
                Profile Information
              </Link>
              <Link
                to="/my-orders"
                className="!flex !items-center !gap-3 !p-3 !text-gray-600 !hover:bg-gray-50 !rounded-lg !font-medium !transition-colors"
              >
                <FiShoppingBag />
                Order History
              </Link>
              <Link
                to="/wishlist"
                className="!flex !items-center !gap-3 !p-3 !text-gray-600 !hover:bg-gray-50 !rounded-lg !font-medium !transition-colors"
              >
                <FiHeart />
                Wishlist
              </Link>
            </nav>
          </div>

          {/* Main Profile Content */}
          <div className="!lg:col-span-2 !space-y-6">
            {/* Profile Card */}
            <div className="!bg-white !rounded-2xl !shadow-lg !overflow-hidden">
              <div className="!bg-gradient-to-r !from-emerald-500 !to-emerald-600 !p-6 !text-white">
                <h2 className="!text-xl !font-semibold">
                  Personal Information
                </h2>
                <p className="!text-emerald-100">Manage your account details</p>
              </div>

              <div className="!p-6 !space-y-6">
                <div className="!grid !grid-cols-1 !md:grid-cols-2 !gap-6">
                  <div className="!space-y-1">
                    <label className="!text-sm !font-medium !text-gray-500">
                      Full Name
                    </label>
                    <p className="!text-lg !font-medium !text-gray-800">
                      {user?.username || "Not provided"}
                    </p>
                  </div>

                  <div className="!space-y-1">
                    <label className="!text-sm !font-medium !text-gray-500">
                      Email Address
                    </label>
                    <div className="!flex !items-center !gap-2">
                      <FiMail className="!text-emerald-600" />
                      <p className="!text-lg !font-medium !text-gray-800">
                        {user?.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="!space-y-1">
                    <label className="!text-sm !font-medium !text-gray-500">
                      Phone Number
                    </label>
                    <div className="!flex !items-center !gap-2">
                      <FiPhone className="!text-emerald-600" />
                      <p className="!text-lg !font-medium !text-gray-800">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="!space-y-1">
                    <label className="!text-sm !font-medium !text-gray-500">
                      Bio Description
                    </label>
                    <p className="!text-lg !font-medium !text-gray-800">
                      {user?.description || "No bio provided"}
                    </p>
                  </div>
                </div>

                <div className="!flex !flex-wrap !gap-4 !pt-4 !border-t !border-gray-200">
                  <Link
                    to={`/profile/edit/${user?._id}`}
                    className="!inline-flex !items-center !gap-2 !px-5 !py-2.5 !bg-emerald-500 !text-white !rounded-lg !font-medium 
                    !shadow-md hover:!shadow-lg !transition-all !duration-300 hover:!bg-emerald-600"
                  >
                    <FiEdit className="!text-sm" />
                    Edit Profile
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="!inline-flex !items-center !gap-2 !px-5 !py-2.5 !bg-red-500 !text-white !rounded-lg !font-medium 
                    !shadow-md hover:!shadow-lg !transition-all !duration-300 hover:!bg-red-600"
                  >
                    <FiTrash2 className="!text-sm" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Account Stats Card */}
            <div className="!bg-white !rounded-2xl !shadow-lg !overflow-hidden">
              <div className="!bg-gradient-to-r !from-gray-700 !to-gray-800 !p-6 !text-white">
                <h2 className="!text-xl !font-semibold">Account Statistics</h2>
                <p className="!text-gray-300">
                  Your activity and membership details
                </p>
              </div>

              <div className="!p-6 !grid !grid-cols-1 !md:grid-cols-2 !gap-6">
                <div className="!flex !items-center !gap-4 !p-4 !bg-gray-50 !rounded-lg">
                  <div className="!p-3 !bg-emerald-100 !rounded-full">
                    <FiCalendar className="!text-emerald-600 !text-xl" />
                  </div>
                  <div>
                    <p className="!text-sm !text-gray-500">Member Since</p>
                    <p className="!font-semibold !text-gray-800">
                      {new Date(user?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="!flex !items-center !gap-4 !p-4 !bg-gray-50 !rounded-lg">
                  <div className="!p-3 !bg-blue-100 !rounded-full">
                    <FiRefreshCw className="!text-blue-600 !text-xl" />
                  </div>
                  <div>
                    <p className="!text-sm !text-gray-500">Last Updated</p>
                    <p className="!font-semibold !text-gray-800">
                      {new Date(user?.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FiHeart icon component (since it wasn't imported)
const FiHeart = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export default Profile;
