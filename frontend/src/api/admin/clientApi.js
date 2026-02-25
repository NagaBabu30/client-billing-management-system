import api from "../axios";

// ➕ Create Client (ADMIN)
export const createClient = (data) => {
  return api.post("/admin/clients", data);
};

// 📄 Get All Clients (ADMIN)
export const getClients = () => {
  return api.get("/admin/clients");
};

// ✏️ Update Client (ADMIN)
export const updateClient = (id, data) => {
  return api.put(`/admin/clients/${id}`, data);
};

// 🗑️ Delete Client (ADMIN)
export const deleteClient = (id) => {
  return api.delete(`/admin/clients/${id}`);
};

