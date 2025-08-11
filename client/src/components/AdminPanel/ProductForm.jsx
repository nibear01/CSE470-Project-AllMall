import React, { useState, useEffect } from "react";
import { X, Save, Package } from "lucide-react";

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

const ProductForm = ({
  isOpen,
  onClose,
  onSave,
  product,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    status: "active",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || "",
        status: product.status || "active",
        imageUrl: product.imageUrl || "",
      });
      setImageFile(null);
      // Set preview URL - handle both full URLs and relative paths
      setImagePreview(
        product.imageUrl
          ? product.imageUrl.startsWith("http")
            ? product.imageUrl
            : `http://localhost:5000${product.imageUrl}`
          : null
      );
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        status: "active",
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setErrors({});
    setSubmitError(null);
  }, [product, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!formData.category) newErrors.category = "Category is required";
    if (!imageFile && !imagePreview)
      newErrors.imageUrl = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imageUrl" || !imageFile) {
          // Don't send imageUrl if we have a new image file
          payload.append(key, value);
        }
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await onSave(payload);
      onClose();
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.imageUrl) {
        setErrors((prev) => ({ ...prev, imageUrl: undefined }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="!fixed !inset-0 !bg-black/50 !flex !items-center !justify-center !p-4 !z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="!bg-white !rounded-[3px] !shadow-2xl !w-full !max-w-2xl !max-h-[90vh] !overflow-y-auto">
        <div className="!flex !items-center !justify-between !p-6 !border-b !border-gray-200">
          <div className="!flex !items-center">
            <Package className="!w-6 !h-6 !text-[var(--hover-color)] !mr-3" />
            <h2 className="!text-2xl !font-bold !text-gray-900">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Close form"
            className="!text-gray-400 !hover:!text-gray-600 !transition-colors !duration-200"
          >
            <X className="!w-6 !h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="!p-6"
          autoComplete="off"
          noValidate
        >
          <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
            {/* Product Name */}
            <div className="md:!col-span-2">
              <label
                htmlFor="name"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Product Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`!w-full !px-4 !py-2 !border !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200 ${
                  errors.name ? "!border-[#cc1030]" : "!border-gray-300"
                }`}
                placeholder="Enter product name"
                disabled={loading}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="!text-[#cc1030] !text-sm !mt-1"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Price (Tk)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                className={`!w-full !px-4 !py-2 !border !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200 ${
                  errors.price ? "!border-[#cc1030]" : "!border-gray-300"
                }`}
                placeholder="0.00"
                disabled={loading}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "price-error" : undefined}
              />
              {errors.price && (
                <p
                  id="price-error"
                  className="!text-[#cc1030] !text-sm !mt-1"
                  role="alert"
                >
                  {errors.price}
                </p>
              )}
            </div>
            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Stock Quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
                className={`!w-full !px-4 !py-2 !border !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200 ${
                  errors.stock ? "!border-[#cc1030]" : "!border-gray-300"
                }`}
                placeholder="0"
                disabled={loading}
                aria-invalid={!!errors.stock}
                aria-describedby={errors.stock ? "stock-error" : undefined}
              />
              {errors.stock && (
                <p
                  id="stock-error"
                  className="!text-[#cc1030] !text-sm !mt-1"
                  role="alert"
                >
                  {errors.stock}
                </p>
              )}
            </div>
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`!w-full !px-4 !py-2 !border !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200 ${
                  errors.category ? "!border-[#cc1030]" : "!border-gray-300"
                }`}
                disabled={loading}
                aria-invalid={!!errors.category}
                aria-describedby={
                  errors.category ? "category-error" : undefined
                }
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p
                  id="category-error"
                  className="!text-[#cc1030] !text-sm !mt-1"
                  role="alert"
                >
                  {errors.category}
                </p>
              )}
            </div>
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:!col-span-2">
              <label
                htmlFor="imageUpload"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Product Image
              </label>

              {/* Preview */}
              {imagePreview && (
                <div className="!mb-2 !h-48 !flex !items-center !justify-center !bg-gray-100 !rounded !border !border-gray-300 !overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="!max-h-full !max-w-full !object-contain"
                  />
                </div>
              )}

              <input
                id="imageUpload"
                name="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`!w-full !border !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200 ${
                  errors.imageUrl ? "!border-[#cc1030]" : "!border-gray-300"
                }`}
                disabled={loading}
                aria-invalid={!!errors.imageUrl}
                aria-describedby={
                  errors.imageUrl ? "imageUrl-error" : undefined
                }
              />
              {errors.imageUrl && (
                <p
                  id="imageUrl-error"
                  className="!text-[#cc1030] !text-sm !mt-1"
                  role="alert"
                >
                  {errors.imageUrl}
                </p>
              )}
            </div>
            {/* Description */}
            <div className="md:!col-span-2">
              <label
                htmlFor="description"
                className="!block !text-sm !font-medium !text-gray-700 !mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className={`!w-full !px-4 !py-2 !border !rounded-[3px] !focus:ring-2 !focus:ring-[var(--hover-color)] !focus:border-[var(--hover-color)] !transition-colors !duration-200 ${
                  errors.description ? "!border-[#cc1030]" : "!border-gray-300"
                }`}
                placeholder="Write a short description of the product"
                disabled={loading}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="!text-[#cc1030] !text-sm !mt-1"
                  role="alert"
                >
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="!text-[#cc1030] !mt-4 !text-center" role="alert">
              {submitError}
            </p>
          )}

          <div className="!flex !justify-end !mt-6 !space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="!px-4 !py-2 !rounded-[3px] !border !border-gray-300 !text-gray-700 !hover:!bg-gray-100 !transition !font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="!px-4 !py-2 !rounded-[3px] !border-1 !hover:!border-[var(--hover-color)] !hover:!text-[var(--hover-color)] !hover:!bg-white !bg-[var(--hover-color)] !text-white !transition-all !font-medium !flex !items-center"
            >
              <Save className="!w-4 !h-4 !mr-2" />
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
