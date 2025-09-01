import { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../../Store/Auth";

const categories = [
  "Fashion",
  "Electronics",
  "Bags",
  "Footwear",
  "Groceries",
  "Beauty",
  "Wellness",
  "Jewellery",
];

const ProductManagement = () => {
  const { url } = useAuth();
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  axios.defaults.baseURL = url;

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((prev) => [...prev, res.data]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (formData) => {
    if (!editingProduct) return;

    try {
      setLoading(true);
      const res = await axios.put(
        `/api/products/${editingProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProducts((prev) =>
        prev.map((prod) => (prod._id === editingProduct._id ? res.data : prod))
      );
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setLoading(true);
      await axios.delete(`/api/products/${_id}`);
      setProducts((prev) => prev.filter((prod) => prod._id !== _id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (product) => {
    setEditingProduct({
      ...product,
      imageUrl: product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `${product.imageUrl}`,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const description = product.description || "";
    const category = product.category || "";
    const status = product.status || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || category === selectedCategory;
    const matchesStatus = !selectedStatus || status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return (
        <span className="!inline-flex !items-center !px-3 !py-1 !rounded-full !text-xs !font-medium !bg-rose-100 !text-rose-800 !transition-all !duration-200">
          Out of Stock
        </span>
      );
    }
    return (
      <span
        className={`!inline-flex !items-center !px-3 !py-1 !rounded-full !text-xs !font-medium !transition-all !duration-200 ${
          status === "active"
            ? "!bg-emerald-100 !text-emerald-800"
            : "!bg-gray-100 !text-gray-800"
        }`}
      >
        {status === "active" ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="!p-4 !sm:p-6 !bg-gray-50 !min-h-screen">
      {/* Header */}
      <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !mb-6">
        <div>
          <h1 className="!text-2xl !sm:text-3xl !font-bold !text-gray-900">
            Product Management
          </h1>
          <p className="!text-gray-600 !mt-1">
            Manage your product inventory and details
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="!mt-4 sm:!mt-0 !py-2 !px-4 !flex !items-center !font-medium !bg-gradient-to-r !from-emerald-500 !to-emerald-600 !text-white !rounded-lg hover:from-emerald-700 hover:to-emerald-800 !transition-all !duration-300 !shadow-md !hover:shadow-lg"
          disabled={loading}
        >
          <Plus className="!w-5 !h-5 !mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !p-4 !mb-4 !transition-all !duration-300">
        <div className="!flex !justify-between !items-center !mb-2">
          <h3 className="!text-lg !font-medium !text-gray-900 !flex !items-center">
            <Filter className="!w-5 !h-5 !mr-2 !text-gray-500" />
            Filters
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="!flex !items-center !text-sm !text-emerald-600 !hover:text-blue-800"
          >
            {showFilters ? (
              <>
                <ChevronUp className="!w-4 !h-4 !mr-1" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="!w-4 !h-4 !mr-1" />
                Show
              </>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 !gap-4 !mt-4 !animate-fadeIn">
            {/* Search */}
            <div className="!relative">
              <Search className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400 !w-4 !h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!w-full !pl-10 !pr-4 !py-2.5 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500 !transition-all !duration-200"
                disabled={loading}
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="!px-4 !py-2.5 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500 !transition-all !duration-200"
              disabled={loading}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="!px-4 !py-2.5 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500 !transition-all !duration-200"
              disabled={loading}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="!px-4 !py-2.5 !bg-gray-100 !hover:bg-gray-200 !text-gray-700 !rounded-lg !transition-all !duration-200 !flex !items-center !justify-center"
            >
              <X className="!w-4 !h-4 !mr-2" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="!flex !items-center !justify-center !py-12">
          <Loader2 className="!w-8 !h-8 !text-blue-500 !animate-spin" />
        </div>
      )}
      {error && (
        <div className="!p-3 !mb-4 !text-center !bg-red-50 !border !border-red-200 !text-red-600 !rounded-lg !text-sm !font-medium !animate-shake">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !overflow-hidden hover:!shadow-md !transition-all !duration-300 !group"
          >
            {/* Product Image */}
            <div className="!relative !aspect-square !bg-gray-200">
              <img
                src={
                  product.imageUrl
                    ? `${url}${product.imageUrl}`
                    : "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300"
                }
                alt={product.name || "Product image"}
                className="!w-full !h-full !object-cover !transition-transform !duration-300 group-hover:!scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300";
                }}
              />
              <div className="!absolute !top-2 !right-2 !flex !gap-2">
                <button
                  onClick={() => openEditForm(product)}
                  className="!p-2 !bg-white/90 !rounded-lg !text-blue-600 !hover:bg-blue-600 !hover:text-white !transition-colors !duration-200 !shadow-sm"
                  disabled={loading}
                >
                  <Edit className="!w-4 !h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="!p-2 !bg-white/90 !rounded-lg !text-rose-600 !hover:bg-rose-600 !hover:text-white !transition-colors !duration-200 !shadow-sm"
                  disabled={loading}
                >
                  <Trash2 className="!w-4 !h-4" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="!p-4">
              <div className="!flex !justify-between !items-start !mb-3">
                <h3 className="!text-lg !font-semibold !text-gray-900 !line-clamp-2">
                  {product.name}
                </h3>
                {getStatusBadge(product.status, product.stock)}
              </div>

              <p className="!text-gray-600 !text-sm !mb-4 !line-clamp-2">
                {product.description}
              </p>

              <div className="!flex !justify-between !items-center !mb-4">
                <div>
                  <p className="!text-xl !font-bold !text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "BDT",
                    }).format(product.price || 0)}
                  </p>
                  <p className="!text-sm !text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
                <span className="!text-xs !px-2 !py-1 !bg-blue-100 !text-blue-800 !rounded-full">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="!text-center !py-12 !animate-fadeIn">
          <div className="!w-24 !h-24 !mx-auto !bg-gray-100 !rounded-full !flex !items-center !justify-center !mb-4">
            <Package className="!w-8 !h-8 !text-gray-400" />
          </div>
          <h3 className="!text-lg !font-medium !text-gray-900 !mb-1">
            No products found
          </h3>
          <p className="!text-gray-500 !mb-6">
            Try adjusting your search criteria or add some products.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="!py-2 !px-6 !font-medium !bg-gradient-to-r !from-emerald-500 !to-emerald-600 !text-white !rounded-lg !hover:from-blue-700 !hover:to-blue-800 !transition-all !duration-300 !shadow-md !hover:shadow-lg"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
        isEditing={!!editingProduct}
      />
    </div>
  );
};

export default ProductManagement;
