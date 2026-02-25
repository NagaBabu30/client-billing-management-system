import api from "../axios";

// 📄 Get my invoices (CLIENT)
export const getMyInvoices = () => {
  return api.get("/client/invoices");
};

// 🔍 Get my invoice by id (CLIENT)
export const getMyInvoiceById = (id) => {
  return api.get(`/client/invoices/${id}`);
};

// 📄 Download my invoice PDF (CLIENT)
export const downloadMyInvoicePdf = (id) => {
  return api.get(`/client/invoices/${id}/pdf`, {
    responseType: "blob",
  });
};
