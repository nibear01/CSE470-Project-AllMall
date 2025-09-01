/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Store/Auth";

const OrderManagement = () => {
  const { url } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    orderStatus: "",
    paymentStatus: "",
    trackingNumber: "",
  });

  // Fetch orders - FIXED VERSION
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required", { position: "top-right" });
        setLoading(false);
        return;
      }

      // Build query URL - use the admin endpoint
      let apiUrl = `${url}/api/orders/admin/allorders`;
      if (filter !== "all") {
        apiUrl += `?status=${filter}`;
      }

      // console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Response:", response);

      // Check if response is OK
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        if (response.status === 403) {
          throw new Error("Admin access required.");
        }
        if (response.status === 404) {
          throw new Error("Orders endpoint not found. Check backend route.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Response data:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      // Set orders from response
      const ordersData = data.orders || data.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error(error.message || "Failed to fetch orders", {
        position: "top-right",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test connection first (no auth needed for test endpoint)
    const testConnection = async () => {
      try {
        const response = await fetch(`${url}/api/orders/test`);
        if (!response.ok) {
          throw new Error(`Test failed: ${response.status}`);
        }
        // const data = await response.json();
        // console.log("Connection test:", data);

        // If connection is good, fetch orders (with auth)
        fetchOrders();
      } catch (error) {
        console.error("Connection test failed:", error);
        toast.error("Cannot connect to server. Make sure backend is running.", {
          position: "top-right",
        });
        setLoading(false);
      }
    };

    testConnection();
  }, [filter]);

  // Update order status
  const updateOrderStatus = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${url}/api/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(statusUpdate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update order");
      }

      await fetchOrders(); // Refresh the orders list
      toast.success("Order updated successfully!", { position: "top-right" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Update order error:", error);
      toast.error(error.message || "Failed to update order", {
        position: "top-right",
      });
    }
  };

  // Helper functions (keep your existing ones)
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "processing":
        return "bg-indigo-100 text-indigo-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-emerald-100 text-emerald-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 !border-t-2 !border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto !px-4 !py-8">
      <h1 className="text-3xl font-bold text-gray-800 !mb-8">
        Order Management
      </h1>

      {/* Filter */}
      <div className="flex !flex-wrap !gap-2 !mb-6">
        {[
          "all",
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`!px-4 !py-2 !rounded-lg ${
              filter === status
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="!bg-white !shadow-md !rounded-lg !overflow-x-auto">
        <table className="min-w-full !divide-y !divide-gray-200">
          <thead className="!bg-gray-50">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Date",
                "Items",
                "Total",
                "Order Status",
                "Payment Status",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="!px-6 !py-3 !text-left !text-xs font-medium !text-gray-500 !uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="!px-6 !py-4 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="!px-6 !py-4 text-sm font-medium text-gray-900">
                    #{order.orderId || "N/A"}
                  </td>
                  <td className="!px-6 !py-4 text-sm text-gray-500">
                    <div>
                      <div className="font-medium">
                        {order.shippingAddress?.firstName || "N/A"}{" "}
                        {order.shippingAddress?.lastName || ""}
                      </div>
                      <div>{order.shippingAddress?.email || "N/A"}</div>
                      <div className="text-xs text-gray-400">
                        {order.shippingAddress?.phone || "No phone"}
                      </div>
                    </div>
                  </td>
                  <td className="!px-6 !py-4 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="!px-6 !py-4 text-sm text-gray-500">
                    {order.items?.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0
                    ) || 0}{" "}
                    items
                  </td>
                  <td className="!px-6 !py-4 text-sm font-medium text-gray-900">
                    Tk {order.totalAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="!px-6 !py-4">
                    <span
                      className={`!px-2 !py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "unknown"}
                    </span>
                  </td>
                  <td className="!px-6 !py-4">
                    <span
                      className={`!px-2 !py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "unknown"}
                    </span>
                  </td>
                  <td className="!px-6 !py-4 !text-sm !font-medium !flex !gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setStatusUpdate({
                          orderStatus: order.orderStatus || "",
                          paymentStatus: order.paymentStatus || "",
                          trackingNumber: order.trackingNumber || "",
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-emerald-500 hover:text-emerald-600"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white !rounded-lg !shadow-xl !max-w-md !w-full !p-6">
            <h2 className="text-xl font-semibold !mb-4">Update Order Status</h2>
            <p className="text-gray-600 !mb-4">
              Order ID: #{selectedOrder.orderId}
            </p>

            <label className="block !text-sm !font-medium !mb-1">
              Order Status
            </label>
            <select
              value={statusUpdate.orderStatus}
              onChange={(e) =>
                setStatusUpdate({
                  ...statusUpdate,
                  orderStatus: e.target.value,
                })
              }
              className="!w-full !mb-3 !px-3 !py-2 !border !border-gray-300 !rounded-md"
            >
              {[
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <label className="block !text-sm !font-medium !mb-1">
              Payment Status
            </label>
            <select
              value={statusUpdate.paymentStatus}
              onChange={(e) =>
                setStatusUpdate({
                  ...statusUpdate,
                  paymentStatus: e.target.value,
                })
              }
              className="!w-full !mb-3 !px-3 !py-2 border border-gray-300 !rounded-md"
            >
              {["pending", "processing", "completed", "failed", "refunded"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                )
              )}
            </select>

            <label className="block !text-sm !font-medium !mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={statusUpdate.trackingNumber}
              onChange={(e) =>
                setStatusUpdate({
                  ...statusUpdate,
                  trackingNumber: e.target.value,
                })
              }
              className="!w-full !mb-3 !px-3 !py-2 !border !border-gray-300 !rounded-md"
              placeholder="Enter tracking number"
            />

            <div className="!flex !justify-end !gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="!px-4 !py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder._id)}
                className="!px-4 !py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-all"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
