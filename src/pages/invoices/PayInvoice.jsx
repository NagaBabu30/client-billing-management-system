import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyInvoiceById } from "../../api/client/invoiceApi";
import { payInvoice } from "../../api/client/paymentApi";

import "./PayInvoice.css";

export default function PayInvoice() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("CASH");

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const res = await getMyInvoiceById(id);
      setInvoice(res.data);
      setAmount(res.data.balance);
    } catch {
      alert("Failed to load invoice");
    }
  };

  const payNow = async () => {

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (amount > invoice.balance) {
      alert("Amount cannot exceed balance");
      return;
    }

    try {

      await payInvoice(invoice.id, Number(amount), mode);

      alert("Payment successful");

      navigate("/invoices");

    } catch {

      alert("Payment failed");

    }

  };

  if (!invoice)
    return (
      <div className="pay-invoice-page">
        <p className="loading">Loading invoice...</p>
      </div>
    );

  if (invoice.status === "PAID")
    return (
      <div className="pay-invoice-page">
        <div className="pay-invoice-card">
          <h2>Invoice #{invoice.id}</h2>
          <p className="paid-message">This invoice is already paid.</p>
        </div>
      </div>
    );

  return (

    <div className="pay-invoice-page">

      <div className="pay-invoice-card">

        <h2>Pay Invoice #{invoice.id}</h2>

        {/* Amount Summary */}

        <div className="invoice-summary">

          <p>
            <span>Total</span>
            <span>₹{invoice.totalAmount}</span>
          </p>

          <p>
            <span>Paid</span>
            <span>₹{invoice.paidAmount}</span>
          </p>

          <p className="balance">
            <span>Balance</span>
            <span>₹{invoice.balance}</span>
          </p>

        </div>


        {/* Payment Form */}

        <div className="payment-form">

          <label>Amount</label>

          <input
            type="number"
            min="1"
            max={invoice.balance}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <label>Payment Mode</label>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>


          <button onClick={payNow}>
            Pay Now
          </button>

        </div>

      </div>

    </div>

  );

}

