import api from "../axios";

// 📄 Get all invoices (ADMIN / ACCOUNTANT)
export const getInvoices = () => {
  return api.get("/accountant/invoices");
};

// ➕ Create invoice (ADMIN / ACCOUNTANT)
export const createInvoice = (data) => {
  return api.post("/accountant/invoices", data);
};

// 🔍 Get invoice by id
export const getInvoiceById = (id) => {
  return api.get(`/accountant/invoices/${id}`);
};

// 📄 Download invoice PDF
export const downloadInvoicePdf = (id) => {
  return api.get(`/accountant/invoices/${id}/pdf`, {
    responseType: "blob",
  });
};
