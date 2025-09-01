/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { X, Save, Package, ImagePlus, Loader2 } from "lucide-react";
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

const ProductForm = ({
  isOpen,
  onClose,
  onSave,
  product,
  isEditing = false,
}) => {
  const { url } = useAuth();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
      setImagePreview(
        product.imageUrl
          ? product.imageUrl.startsWith("http")
            ? product.imageUrl
            : `${url}${product.imageUrl}`
          : null
      );
    } else {
      resetForm();
    }
  }, [product, isEditing, isOpen]);

  const resetForm = () => {
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
    setErrors({});
    setSubmitError(null);
  };

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

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imageUrl" || !imageFile) {
          payload.append(key, value);
        }
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await onSave(payload);
      onClose();
      resetForm();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.imageUrl) {
        setErrors((prev) => ({ ...prev, imageUrl: undefined }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="!fixed !inset-0 !bg-black/50 !flex !items-center !justify-center !p-4 !z-50 !animate-fadeIn">
      <div className="!bg-white !rounded-xl !shadow-xl !w-full !max-w-2xl !max-h-[90vh] !overflow-y-auto !animate-slideUp">
        {/* Header */}
        <div className="!flex !items-center !justify-between !p-6 !border-b !border-gray-200 !sticky !top-0 !bg-white !z-10">
          <div className="!flex !items-center">
            <Package className="!w-6 !h-6 !text-emerald-600 !mr-3" />
            <h2 className="!text-2xl !font-bold !text-gray-900">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="!p-1 !rounded-full !text-gray-400 hover:!bg-gray-100 hover:!text-gray-600 !transition-colors"
          >
            <X className="!w-6 !h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="!p-6" noValidate>
          <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
            {/* Product Name */}
            <div className="md:!col-span-2">
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`!w-full !px-4 !py-2.5 !border !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !transition-all ${
                  errors.name ? "!border-rose-500" : "!border-gray-300"
                }`}
                placeholder="Enter product name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="!text-rose-600 !text-sm !mt-1">{errors.name}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Price (Tk) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                className={`!w-full !px-4 !py-2.5 !border !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !transition-all ${
                  errors.price ? "!border-rose-500" : "!border-gray-300"
                }`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="!text-rose-600 !text-sm !mt-1">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
                className={`!w-full !px-4 !py-2.5 !border !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !transition-all ${
                  errors.stock ? "!border-rose-500" : "!border-gray-300"
                }`}
                placeholder="0"
                disabled={isSubmitting}
              />
              {errors.stock && (
                <p className="!text-rose-600 !text-sm !mt-1">{errors.stock}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`!w-full !px-4 !py-2.5 !border !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !transition-all ${
                  errors.category ? "!border-rose-500" : "!border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="!text-rose-600 !text-sm !mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="!w-full !px-4 !py-2.5 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !transition-all"
                disabled={isSubmitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="md:!col-span-2">
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Product Image *
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("imageUpload").click()}
                className={`!cursor-pointer !border-2 !border-dashed !rounded-lg !p-6 !text-center !transition-all ${
                  isDragging
                    ? "!border-emerald-500 !bg-emerald-50"
                    : errors.imageUrl
                    ? "!border-rose-500 !bg-rose-50"
                    : "!border-gray-300 hover:!border-emerald-500"
                }`}
              >
                {imagePreview ? (
                  <div className="!relative !group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="!w-full !h-48 !object-contain !rounded"
                    />
                    <div className="!absolute !inset-0 !bg-black/50 !flex !items-center !justify-center !opacity-0 group-hover:!opacity-100 !transition-opacity">
                      <div className="!text-white !text-center !p-4">
                        <ImagePlus className="!w-8 !h-8 !mx-auto !mb-2" />
                        <p>Click or drag to change image</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="!space-y-2">
                    <ImagePlus className="!w-10 !h-10 !mx-auto !text-gray-400" />
                    <p className="!text-sm !text-gray-600">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="!text-xs !text-gray-500">
                      Recommended size: 800x800px
                    </p>
                  </div>
                )}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="!hidden"
                  disabled={isSubmitting}
                />
              </div>
              {errors.imageUrl && (
                <p className="!text-rose-600 !text-sm !mt-1">
                  {errors.imageUrl}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:!col-span-2">
              <label className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className={`!w-full !px-4 !py-2.5 !border !rounded-lg !focus:ring-2 !focus:ring-emerald-500 !focus:border-emerald-500 !transition-all ${
                  errors.description ? "!border-rose-500" : "!border-gray-300"
                }`}
                placeholder="Write a detailed description of the product..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="!text-rose-600 !text-sm !mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <div className="!mt-4 !p-3 !bg-rose-50 !border !border-rose-200 !text-rose-600 !rounded-lg !text-sm">
              {submitError}
            </div>
          )}

          <div className="!flex !justify-end !mt-8 !space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="!px-6 !py-2.5 !border !border-gray-300 !rounded-lg !text-gray-700 hover:!bg-gray-50 !font-medium !transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="!px-6 !py-2.5 !bg-gradient-to-r !from-emerald-500 !to-emerald-600 !text-white !rounded-lg hover:!from-emerald-600 hover:!to-emerald-700 !font-medium !transition-all !flex !items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="!w-4 !h-4 !mr-2 !animate-spin" />
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : (
                <>
                  <Save className="!w-4 !h-4 !mr-2" />
                  {isEditing ? "Save Changes" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
