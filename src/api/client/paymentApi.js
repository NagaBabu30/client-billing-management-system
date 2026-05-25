import api from "../axios";

// 💳 Client pays own invoice
export const payInvoice = (invoiceId, amount, paymentMode) => {
  return api.post("/client/payments", {
    invoiceId,
    amount,
    paymentMode, // CASH | UPI | CARD | NET_BANKING
  });
};

// 📄 Client views own payments
export const getMyPayments = () => {
  return api.get("/client/payments");
};
