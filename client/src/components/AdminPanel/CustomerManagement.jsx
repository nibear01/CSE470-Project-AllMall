/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../Store/Auth";

const CustomerManagement = () => {
  const { url } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalCustomer, setModalCustomer] = useState(null);

  const allUsers = async () => {
    try {
      const response = await fetch(`${url}/api/auth/allusers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        // Only keep non-admin users
        const customersList = Array.isArray(data.users)
          ? data.users.filter((user) => !user.isAdmin)
          : [];
        setCustomers(customersList);
      } else {
        toast.error("Failed to fetch users!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching users!");
    }
  };

  useEffect(() => {
    allUsers();
  }, []);

  // Delete a user
  const handleDeleteCustomer = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `${url}/api/auth/user/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCustomers((prev) => prev.filter((c) => c._id !== userId));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting user!");
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "!bg-green-100", text: "!text-green-800", icon: UserCheck },
      inactive: { bg: "!bg-gray-100", text: "!text-gray-800", icon: UserX },
      blocked: { bg: "!bg-red-100", text: "!text-red-800", icon: Shield },
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    return (
      <span
        className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="!w-3 !h-3 !mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Filtered users
  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((customer) => {
        const matchesSearch =
          customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
    : [];

  return (
    <div className="!p-4 sm:!p-6">
      {/* Header */}
      <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !mb-6">
        <div>
          <h1 className="!text-2xl sm:!text-3xl !font-bold !text-gray-900">
            Customer Management
          </h1>
          <p className="!text-gray-600 !mt-1">Manage customer accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !p-4 sm:!p-6 !mb-6">
        <div className="!flex !flex-col lg:!flex-row !gap-4">
          <div className="!flex-1 !relative">
            <Search className="!absolute !left-3 !top-1/2 !transform -!translate-y-1/2 !text-gray-400 !w-4 !h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!w-full !pl-10 !pr-4 !py-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !transition-colors !duration-200"
            />
          </div>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 xl:!grid-cols-3 !gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer._id}
            className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !p-4 sm:!p-6 hover:!shadow-md !transition-shadow !duration-200 !relative"
          >
            <div className="!flex !items-start !justify-between !mb-4">
              <div className="!flex !items-center">
                <img
                  src={
                    customer.image
                      ? `${url}${customer.image}`
                      : "/src/assets/demo_user.png"
                  }
                  alt={customer.username}
                  className="!w-12 !h-12 !rounded-full !object-cover !mr-3"
                />
                <div>
                  <h3 className="!text-lg !font-semibold !text-gray-900">
                    {customer.username}
                  </h3>
                  <p className="!text-sm !text-gray-500">
                    Joined {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
              {getStatusBadge("active")}
            </div>
            <div className="!space-y-2 !mb-4">
              <div className="!flex !items-center !text-sm !text-gray-600">
                <Mail className="!w-4 !h-4 !mr-2" /> {customer.email}
              </div>
              <div className="!flex !items-center !text-sm !text-gray-600">
                <Phone className="!w-4 !h-4 !mr-2" /> {customer.phone}
              </div>
              <div className="!flex !items-center !text-sm !text-gray-600">
                <MapPin className="!w-4 !h-4 !mr-2" /> {customer.address}
              </div>
            </div>
            <button
              onClick={() => handleDeleteCustomer(customer._id)}
              className="!absolute !bottom-10 !right-6 !px-2 !py-1 !bg-red-500 !text-white !rounded-lg !text-xs hover:!bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="!text-center !py-12">
          <div className="!w-24 !h-24 !mx-auto !bg-gray-100 !rounded-full !flex !items-center !justify-center !mb-4">
            <Users className="!w-8 !h-8 !text-gray-400" />
          </div>
          <h3 className="!text-lg !font-medium !text-gray-900 !mb-2">
            No customers found
          </h3>
          <p className="!text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
