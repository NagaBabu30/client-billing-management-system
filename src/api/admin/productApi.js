import api from "../axios";

// ➕ Create Product (ADMIN)
export const createProduct = (data) => {
  return api.post("/admin/products", data);
};

// 📄 Get All Products (ADMIN / ACCOUNTANT)
export const getProducts = () => {
  return api.get("/admin/products");
};

// 🔍 Get Product By ID (ADMIN)
export const getProductById = (id) => {
  return api.get(`/admin/products/${id}`);
};

// ✏️ Update Product (ADMIN)
export const updateProduct = (id, data) => {
  return api.put(`/admin/products/${id}`, data);
};

// 🗑️ Delete Product (ADMIN)
export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`);
};

