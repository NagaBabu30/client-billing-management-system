import api from "../axios";

// 💰 Make payment (ADMIN / ACCOUNTANT)
export const makePayment = (invoiceId, amount, paymentMode) => {
  return api.post("/payments", {
    invoiceId,
    amount,
    paymentMode,
  });
};

// 📄 Get all payments
export const getPayments = () => {
  return api.get("/payments");
};
