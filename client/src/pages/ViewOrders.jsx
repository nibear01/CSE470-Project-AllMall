/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Store/Auth";

const ViewOrders = () => {
  const { url } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const cancelOrder = async (order) => {
    // Check if order can be cancelled
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      toast.error("Order cannot be cancelled at this stage", {
        position: "top-right",
      });
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to cancel order #${order.orderId}?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${url}/api/orders/${order._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!", {
          position: "top-right",
        });

        // Refresh the orders list
        fetchOrders();

        // If the cancelled order is currently being viewed, close the modal
        if (selectedOrder && selectedOrder._id === order._id) {
          closeOrderDetails();
        }
      } else {
        throw new Error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);

      let errorMessage = "Failed to cancel order";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "!bg-amber-100", text: "!text-amber-800", icon: Clock },
      confirmed: { bg: "!bg-blue-100", text: "!text-blue-800", icon: Package },
      processing: {
        bg: "!bg-indigo-100",
        text: "!text-indigo-800",
        icon: Package,
      },
      shipped: { bg: "!bg-purple-100", text: "!text-purple-800", icon: Truck },
      delivered: {
        bg: "!bg-emerald-100",
        text: "!text-emerald-800",
        icon: CheckCircle,
      },
      cancelled: { bg: "!bg-rose-100", text: "!text-rose-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`!inline-flex !items-center !px-3 !py-1 !rounded-full !text-xs !font-medium ${config.bg} ${config.text} !transition-all !duration-200`}
      >
        <Icon className="!w-3 !h-3 !mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { bg: "!bg-amber-100", text: "!text-amber-800" },
      processing: { bg: "!bg-blue-100", text: "!text-blue-800" },
      completed: { bg: "!bg-emerald-100", text: "!text-emerald-800" },
      failed: { bg: "!bg-rose-100", text: "!text-rose-800" },
      refunded: { bg: "!bg-gray-100", text: "!text-gray-800" },
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;

    return (
      <span
        className={`!inline-flex !items-center !px-3 !py-1 !rounded-full !text-xs !font-medium ${config.bg} ${config.text} !transition-all !duration-200`}
      >
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount || 0);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    document.body.style.overflow = "hidden";
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
    document.body.style.overflow = "auto";
  };

  if (isLoading) {
    return (
      <div className="!flex !items-center !justify-center !min-h-screen !bg-gray-50">
        <div className="!text-center">
          <div className="!inline-block !w-12 !h-12 !border-4 !border-t-[var(--hover-color)] !border-gray-200 !rounded-full !animate-spin"></div>
          <p className="!mt-4 !text-gray-600 !text-lg">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="!min-h-screen !bg-gray-50 !py-8 !px-4 sm:!px-6 lg:!px-8"
    >
      <div className="!max-w-6xl !mx-auto">
        {/* Header */}
        <div className="!flex !flex-col !sm:flex-row !justify-between !items-start !sm:items-center !mb-8">
          <div className="!flex !items-center !gap-4">
            <Link
              to="/"
              className="!p-2 !bg-white !rounded-lg !shadow-sm !hover:shadow-md !transition-shadow !duration-200"
            >
              <ArrowLeft className="!w-5 !h-5 !text-gray-600" />
            </Link>
            <div>
              <h1 className="!text-2xl !sm:text-3xl !font-bold !text-gray-900">
                My Orders
              </h1>
              <p className="!text-gray-600 !mt-1">
                Track and manage your orders
              </p>
            </div>
          </div>

          <div className="!flex !items-center !gap-4 !mt-4 !sm:mt-0">
            <span className="!text-sm !text-gray-500">
              <span className="!font-semibold !text-gray-900">
                {orders.length}
              </span>{" "}
              order(s)
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="!p-2 !bg-white !border !border-gray-300 !rounded-lg !hover:bg-gray-50 !disabled:opacity-50 !transition-colors !duration-200"
            >
              <RefreshCw
                className={`!w-4 !h-4 ${refreshing ? "!animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="!text-center !py-16 !bg-white !rounded-xl !shadow-sm"
          >
            <div className="!inline-block !p-6 !bg-gray-100 !rounded-full !mb-6">
              <Package className="!w-12 !h-12 !text-gray-400" />
            </div>
            <h3 className="!text-xl !font-semibold !text-gray-700 !mb-4">
              No orders yet
            </h3>
            <p className="!text-gray-500 !mb-8 !max-w-md !mx-auto">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link
              to="/products"
              className="!inline-block !px-6 !py-3 !bg-[var(--hover-color)] !text-white !rounded-lg !hover:bg-[var(--hover-color-dark)] !transition-colors !font-medium"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="!space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !overflow-hidden !hover:shadow-md !transition-shadow !duration-200"
              >
                <div className="!p-6">
                  <div className="!flex !flex-col !lg:flex-row !justify-between !items-start !lg:items-center !gap-4">
                    {/* Order Info */}
                    <div className="!flex-1">
                      <div className="!flex !items-center !gap-3 !mb-2">
                        <h3 className="!text-lg !font-semibold !text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                      <p className="!text-gray-600 !text-sm !mb-2">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      <p className="!text-lg !font-bold !text-[var(--hover-color)]">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="!flex !items-center !gap-6 !text-sm !text-gray-600">
                      <div className="!text-center">
                        <div className="!font-semibold !text-gray-900">
                          {order.totalItems}
                        </div>
                        <div>Items</div>
                      </div>
                      <div className="!w-px !h-8 !bg-gray-300"></div>
                      <div className="!text-center">
                        <div className="!font-medium">
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                        <div>Payment</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="!px-4 !py-2 !bg-[var(--hover-color)] !text-white !rounded-lg !hover:bg-[var(--hover-color-dark)] !transition-colors !font-medium"
                      >
                        View Details
                      </button>
                      {["pending", "confirmed"].includes(order.orderStatus) && (
                        <button
                          onClick={() => cancelOrder(order)}
                          className="!px-4 !py-2 !bg-red-500 !text-white !rounded-lg !hover:bg-red-700 !transition-colors !font-medium !ml-2"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="!fixed !inset-0 !bg-black/50 !flex !items-center !justify-center !p-4 !z-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="!bg-white !rounded-xl !shadow-2xl !w-full !max-w-4xl !max-h-[90vh] !overflow-y-auto"
            >
              {/* Header */}
              <div className="!flex !justify-between !items-center !p-6 !border-b !border-gray-200 !sticky !top-0 !bg-white !z-10">
                <div>
                  <h2 className="!text-xl !font-bold !text-gray-900">
                    Order Details
                  </h2>
                  <p className="!text-gray-600">#{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={closeOrderDetails}
                  className="!p-2 !rounded-full !text-gray-400 !hover:text-gray-600 !hover:bg-gray-100 !transition-colors"
                >
                  <XCircle className="!w-6 !h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="!p-6 ">
                {/* Order Status Timeline */}
                <div className="!mb-8">
                  <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4 !flex !items-center">
                    <Truck className="!w-5 !h-5 !mr-2 !text-blue-500" />
                    Order Status
                  </h3>
                  <div className="!bg-gray-50 !rounded-lg !p-4">
                    <div className="!flex !items-center !justify-between !mb-2">
                      <span className="!text-sm !font-medium !text-gray-700">
                        Current Status:
                      </span>
                      {getStatusBadge(selectedOrder.orderStatus)}
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="!flex !items-center !justify-between !mt-3 !pt-3 !border-t !border-gray-200">
                        <span className="!text-sm !font-medium !text-gray-700">
                          Tracking Number:
                        </span>
                        <span className="!text-sm !font-mono !text-[var(--hover-color)]">
                          {selectedOrder.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="!grid !grid-cols-1 !lg:grid-cols-2 !gap-6 !mb-8">
                  <div className="!bg-gray-50 !rounded-lg !p-5">
                    <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4 !flex !items-center">
                      <MapPin className="!w-5 !h-5 !mr-2 !text-blue-500" />
                      Shipping Address
                    </h3>
                    <div className="!space-y-2 !text-gray-700">
                      <p className="!font-medium">
                        {selectedOrder.shippingAddress.firstName}{" "}
                        {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <div className="!flex !items-center !gap-2 !mt-3">
                        <Mail className="!w-4 !h-4 !text-gray-500" />
                        <span>{selectedOrder.shippingAddress.email}</span>
                      </div>
                      <div className="!flex !items-center !gap-2">
                        <Phone className="!w-4 !h-4 !text-gray-500" />
                        <span>{selectedOrder.shippingAddress.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="!bg-gray-50 !rounded-lg !p-5">
                    <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4 !flex !items-center">
                      <Package className="!w-5 !h-5 !mr-2 !text-blue-500" />
                      Order Information
                    </h3>
                    <div className="!space-y-3 !text-sm">
                      <div className="!flex !justify-between">
                        <span className="!text-gray-600">Order Date:</span>
                        <span className="!font-medium">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </div>
                      <div className="!flex !justify-between">
                        <span className="!text-gray-600">Payment Method:</span>
                        <span className="!font-medium !capitalize">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="!flex !justify-between">
                        <span className="!text-gray-600">Payment Status:</span>
                        {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                      </div>
                      <div className="!flex !justify-between">
                        <span className="!text-gray-600">Items:</span>
                        <span className="!font-medium">
                          {selectedOrder.totalItems} item(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="!my-8">
                  <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="!space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item._id}
                        className="!flex !items-center !p-4 !bg-gray-50 !rounded-lg !border !border-gray-200"
                      >
                        <img
                          src={`${url}${item.imageUrl}`}
                          alt={item.name}
                          className="!w-16 !h-16 !object-cover !rounded !mr-4 !border !border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/64x64?text=Product";
                          }}
                        />
                        <div className="!flex-1">
                          <h4 className="!font-medium !text-gray-900">
                            {item.name}
                          </h4>
                          <p className="!text-sm !text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="!text-sm !text-gray-600">
                            Price: {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="!text-right">
                          <p className="!font-semibold !text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="!bg-gray-50 !rounded-lg !p-5">
                  <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4 !flex !items-center">
                    {/* <DollarSign className="!w-5 !h-5 !mr-2 !text-blue-500" /> */}
                    Order Summary
                  </h3>
                  <div className="!space-y-3 !text-sm">
                    <div className="!flex !justify-between">
                      <span className="!text-gray-600">Subtotal:</span>
                      <span className="!font-medium">
                        {formatCurrency(selectedOrder.subtotal)}
                      </span>
                    </div>
                    <div className="!flex !justify-between">
                      <span className="!text-gray-600">Shipping Fee:</span>
                      <span className="!font-medium">
                        {formatCurrency(selectedOrder.shippingFee)}
                      </span>
                    </div>
                    <div className="!border-t !border-gray-200 !pt-3 !mt-3">
                      <div className="!flex !justify-between !text-base !font-semibold">
                        <span className="!text-gray-900">Total:</span>
                        <span className="!text-[var(--hover-color)]">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="!mt-6 !bg-yellow-50 !rounded-lg !p-4 !border !border-yellow-100">
                    <h3 className="!text-sm !font-medium !text-yellow-800 !mb-2">
                      Order Notes
                    </h3>
                    <p className="!text-sm !text-yellow-700">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ViewOrders;
