import { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

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
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  axios.defaults.baseURL = "http://localhost:5000";

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
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
      alert(err.response?.data?.message || "Failed to add product");
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
      alert(err.response?.data?.message || "Failed to update product");
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
      alert(err.response?.data?.message || "Failed to delete product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (product) => {
    setEditingProduct({
      ...product,
      // Ensure the imageUrl has the full path when editing
      imageUrl: product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `http://localhost:5000/${product.imageUrl}`,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
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
        <span className="!inline-flex !items-center !px-2.5 !py-0.5 !rounded-[3px] !text-xs !font-medium !bg-[#f44336] !text-[#f44336]">
          Out of Stock
        </span>
      );
    }
    return (
      <span
        className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-[3px] !text-xs !font-medium ${
          status === "active"
            ? "!bg-green-100 !text-green-800"
            : "!bg-gray-100 !text-gray-800"
        }`}
      >
        {status === "active" ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="!p-6">
      <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !mb-6">
        <div>
          <h1 className="!text-3xl !font-bold !text-gray-900">
            Product Management
          </h1>
          <p className="!text-gray-600 !mt-1">
            Manage your product inventory and details
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="!mt-4 sm:!mt-0 !py-1 !flex !items-center !px-2 !font-[500] !border-1 hover:!border-[var(--hover-color)] hover:!text-[var(--hover-color)] hover:!bg-white !bg-[var(--hover-color)] !text-white !rounded-[3px] !transition-all"
          disabled={loading}
        >
          <Plus className="!w-4 !h-4 !mr-2" />
          Add Product
        </button>
      </div>

      <div className="!bg-white !rounded-[3px] !xl !shadow-sm !border !border-gray-200 !p-6 !mb-6">
        <div className="!flex !flex-col lg:!flex-row !gap-4">
          <div className="!flex-1 !relative">
            <Search className="!absolute !left-3 !top-1/2 !transform !-translate-y-1/2 !text-gray-400 !w-4 !h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!w-full !pl-10 !pr-4 !py-2 !border !outline-0 !border-gray-300 !rounded-[3px] lg:!focus:ring-2 lg:!focus:ring-emerald-500 !outline-none !transition"
              disabled={loading}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="!px-4 !py-2 !border !border-gray-300 !rounded-[3px] lg:!focus:ring-2 lg:!focus:ring-emerald-500 !outline-none !transition"
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="!capitalize">
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="!px-4 !py-2 !border !border-gray-300 !rounded-[3px] lg:!focus:ring-2 lg:!focus:ring-emerald-500 !outline-none !transition"
            disabled={loading}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="!text-center !text-gray-500 !mb-4">Loading...</p>
      )}
      {error && <p className="!text-center !text-[#f44336] !mb-4">{error}</p>}

      <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="!bg-white !rounded-[3px] !xl !shadow-sm !border !border-gray-200 !overflow-hidden hover:!shadow-md !transition-shadow !duration-200"
          >
            <div className="!aspect-w-16 !aspect-h-12 !bg-gray-200 !h-48">
              <img
                src={
                  product.imageUrl
                    ? `http://localhost:5000${product.imageUrl}`
                    : "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300"
                }
                alt={product.name || "Product image"}
                className="!w-full !h-full !object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300";
                }}
              />
            </div>

            <div className="!p-6">
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
                  <p className="!text-2xl !font-bold !text-gray-900">
                    Tk. {product.price}
                  </p>
                  <p className="!text-sm !text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
                <span className="!text-xs !px-2 !py-1 !bg-blue-100 !text-blue-800 !rounded-[3px] full">
                  {product.category}
                </span>
              </div>

              <div className="!flex !space-x-2">
                <button
                  onClick={() => openEditForm(product)}
                  className="!flex-1 !bg-blue-500 !text-white !py-1 !px-2 !rounded-[3px] !border hover:!border-blue hover:!bg-white hover:!text-blue-500 !transition !flex !items-center !justify-center !text-sm !font-medium"
                  disabled={loading}
                >
                  <Edit className="!w-4 !h-4 !mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="!flex-1 !bg-[#f44336] !text-white !py-1 !px-2 !rounded-[3px] !border hover:!bg-white hover:!text-[#f44336] hover:!border-[#f44336] !transition !flex !items-center !justify-center !text-sm !font-medium"
                  disabled={loading}
                >
                  <Trash2 className="!w-4 !h-4 !mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="!text-center !py-12">
          <div className="!w-24 !h-24 !mx-auto !bg-gray-100 !rounded-[3px] full !flex !items-center !justify-center !mb-4">
            <Package className="!w-8 !h-8 !text-gray-400" />
          </div>
          <h3 className="!text-lg !font-medium !text-gray-900 !mb-2">
            No products found
          </h3>
          <p className="!text-gray-500 !mb-6">
            Try adjusting your search criteria or add some products.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="!mt-4 !py-2 !px-2 !font-[500] !border-1 hover:!border-[var(--hover-color)] hover:!text-[var(--hover-color)] hover:!bg-white !bg-[var(--hover-color)] !text-white !rounded-[3px] !transition-all"
          >
            Add Your First Product
          </button>
        </div>
      )}

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
