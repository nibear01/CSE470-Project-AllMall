import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  axios.defaults.baseURL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products");
        setProducts(res.data);
        setError(null);
      } catch (err) {
        setError(`Failed to load products ${err}`);
      } finally {
        setLoading(false);
      }
    };

    const totalUser = async () => {
      try {
        const res = await axios.get("/api/auth/allusers");
        // console.log(res.data.users);

        //for eliminating admin
        const count = res.data.users.filter((e) => !e.isAdmin);
        setUserCount(count.length.toLocaleString());
      } catch (error) {
        console.log(error);
      }
    };
    totalUser();
    fetchProducts();
  }, []);

  // Stats array with dynamic total products count
  const stats = [
    {
      title: "Total Products",
      value: products.length.toLocaleString(),
      change: "+12%",
      icon: Package,
      color: "blue",
    },
    // you can add other stats dynamically or keep them static for now
    {
      title: "Total Orders",
      value: "0",
      change: "+8%",
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: "Total Customers",
      value: userCount,
      change: "+15%",
      icon: Users,
      color: "purple",
    },
    {
      title: "Revenue",
      value: "0",
      change: "+22%",
      icon: DollarSign,
      color: "emerald",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-blue-100",
      green: "bg-green-500 text-green-100",
      purple: "bg-purple-500 text-purple-100",
      emerald: "bg-emerald-500 text-emerald-100",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="!p-6">
      <div className="!mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 !mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-6 !mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 !p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 !mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 font-medium flex items-center !mt-2">
                    {/* <TrendingUp className="!w-4 !h-4 !mr-1" /> */}
                    {/* {stat.change} from last month */}
                  </p>
                </div>
                <div
                  className={`!w-12 !h-12 rounded-lg ${getColorClasses(
                    stat.color
                  )} flex items-center justify-center`}
                >
                  <Icon className="!w-6 !h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="!p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Products
          </h2>
          <p className="text-gray-600 !text-sm !mt-1">
            Latest products added to your inventory
          </p>
        </div>

        {loading ? (
          <p className="!p-6 text-center text-gray-600">Loading products...</p>
        ) : error ? (
          <p className="!p-6 text-center text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="!p-6 text-center text-gray-600">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="!px-6 !py-3 text-left text-xs !font-medium text-gray-500 !uppercase !tracking-wider">
                    Product
                  </th>
                  <th className="!px-6 !py-3 text-left text-xs !font-medium text-gray-500 !uppercase !tracking-wider">
                    Price
                  </th>
                  <th className="!px-6 !py-3 text-left text-xs !font-medium text-gray-500 !uppercase !tracking-wider">
                    Stock
                  </th>
                  <th className="!px-6 !py-3 text-left text-xs !font-medium text-gray-500 !uppercase !tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product._id || product.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="!px-6 !py-4 !whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="!px-6 !py-4 !whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">
                        Tk. {product.price?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="!px-6 !py-4 !whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock} units
                      </div>
                    </td>
                    <td className="!px-6 !py-4 !whitespace-nowrap">
                      <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
