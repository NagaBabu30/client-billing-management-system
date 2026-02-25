import api from "../axios";

// ❌ Delete invoice (ADMIN ONLY)
export const deleteInvoice = (id) => {
  return api.delete(`/admin/invoices/${id}`);
};
