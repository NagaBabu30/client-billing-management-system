import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import "./InvoiceView.css";

import {
  getInvoiceById,
  downloadInvoicePdf,
} from "../../api/accountant/invoiceApi";

import {
  getMyInvoiceById,
  downloadMyInvoicePdf,
} from "../../api/client/invoiceApi";

export default function InvoiceView() {

  const { id } = useParams();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, []);

  // LOAD INVOICE
  const loadInvoice = async () => {
    try {
      const res =
        user.role === "CLIENT"
          ? await getMyInvoiceById(id)
          : await getInvoiceById(id);

      setInvoice(res.data);

    } catch (err) {
      console.error(err);
      alert("Failed to load invoice");
    }
  };

  // DOWNLOAD PDF
  const exportPdf = async () => {
    try {

      const res =
        user.role === "CLIENT"
          ? await downloadMyInvoicePdf(id)
          : await downloadInvoicePdf(id);

      const blob = new Blob([res.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      window.open(url);

    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  };

  if (!invoice) {
    return (
      <div className="invoice-page">
        <p className="loading">Loading invoice...</p>
      </div>
    );
  }

  return (
    <div className="invoice-page">

      <div className="invoice-card">

        {/* HEADER */}
        <div className="invoice-header">

          <div>
            <h2>Invoice #{invoice.id}</h2>

            <span className={`status ${invoice.status}`}>
              {invoice.status}
            </span>
          </div>

          <button onClick={exportPdf}>
            Download PDF
          </button>

        </div>

        {/* CLIENT DETAILS */}
        <div className="invoice-section">

          <h3>Client Details</h3>

          <p>
            <strong>Name:</strong> {invoice.client?.name || "-"}
          </p>

          <p>
            <strong>Email:</strong> {invoice.client?.email || "-"}
          </p>

        </div>

        {/* INVOICE DETAILS */}
        <div className="invoice-section">

          <h3>Invoice Details</h3>

          <p>
            <strong>Issue Date:</strong> {invoice.issueDate}
          </p>

          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>

        </div>

        {/* ITEMS TABLE */}
        <table className="invoice-table">

          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Tax %</th>
              <th>Discount %</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>

            {invoice.items?.length > 0 ? (

              invoice.items.map(item => (

                <tr key={item.id}>

                  {/* FIXED PRODUCT NAME */}
                  <td>{item.product?.name || "-"}</td>

                  <td>₹{item.price}</td>

                  <td>{item.tax}%</td>

                  <td>{item.discount}%</td>

                  <td>{item.quantity}</td>

                  <td>₹{item.total}</td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="6" align="center">
                  No items found
                </td>
              </tr>

            )}

          </tbody>

        </table>

        {/* SUMMARY */}
        <div className="invoice-summary">

          <p>
            <span>Total Amount:</span>
            <span>₹{invoice.totalAmount}</span>
          </p>

          <p>
            <span>Paid Amount:</span>
            <span>₹{invoice.paidAmount}</span>
          </p>

          <p className="balance">
            <span>Balance:</span>
            <span>₹{invoice.balance}</span>
          </p>

        </div>

      </div>

    </div>
  );
}

