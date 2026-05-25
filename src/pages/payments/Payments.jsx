import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import "./Payments.css";

export default function Payments() {

  const { user } = useAuth();
  const role = user?.role;

  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payments Filters
  const [paySearch, setPaySearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Outstanding Filters
  const [outSearch, setOutSearch] = useState("");
  const [minBalance, setMinBalance] = useState("");

  useEffect(() => {
    if (role) loadData();
  }, [role]);

  const loadData = async () => {
    try {
      const paymentsUrl =
        role === "CLIENT"
          ? "/client/payments"
          : "/accountant/payments";

      const invoicesUrl =
        role === "CLIENT"
          ? "/client/invoices"
          : "/accountant/invoices";

      const payRes = await api.get(paymentsUrl);
      const invRes = await api.get(invoicesUrl);

      setPayments(payRes.data || []);
      setInvoices(invRes.data || []);

    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const formatInvoiceNo = (id) =>
    `INV-${String(id).padStart(3, "0")}`;

  // ✅ Currency Formatter Added
  const formatCurrency = (amount) =>
    "₹ " + Number(amount).toLocaleString("en-IN");

  const filteredPayments = payments.filter(p => {
    return (
      formatInvoiceNo(p.invoiceId)
        .toLowerCase()
        .includes(paySearch.toLowerCase()) &&
      (!fromDate || p.paymentDate >= fromDate) &&
      (!toDate || p.paymentDate <= toDate) &&
      (!minAmount || p.amount >= Number(minAmount)) &&
      (!maxAmount || p.amount <= Number(maxAmount))
    );
  });

  const filteredOutstanding = invoices
    .filter(i => i.balance > 0)
    .filter(inv => {
      return (
        (
          formatInvoiceNo(inv.id)
            .toLowerCase()
            .includes(outSearch.toLowerCase()) ||
          inv.client?.name
            ?.toLowerCase()
            .includes(outSearch.toLowerCase())
        ) &&
        (!minBalance || inv.balance >= Number(minBalance))
      );
    });

  if (!user) return <p>Unauthorized</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="payments-page">

      {/* Header */}
      <div className="page-header">
        <h2>Payments</h2>
      </div>

      {/* ================= PAYMENTS SECTION ================= */}
      <div className="section-block">

        {/* Filters */}
        <div className="filter-bar">
          <input
            placeholder="🔍 Search Invoice"
            value={paySearch}
            onChange={(e) => setPaySearch(e.target.value)}
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min ₹"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length ? (
                filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{formatInvoiceNo(p.invoiceId)}</td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td>{p.paymentMode}</td>
                    <td>{p.paymentDate}</td>
                    <td>
                      <span className={`status ${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= OUTSTANDING SECTION ================= */}
      {role !== "CLIENT" && (
        <div className="section-block">

          <h3 className="section-title">Outstanding Invoices</h3>

          {/* Filters */}
          <div className="filter-bar">
            <input
              placeholder="🔍 Search Invoice / Client"
              value={outSearch}
              onChange={(e) => setOutSearch(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Balance ₹"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutstanding.length ? (
                  filteredOutstanding.map((inv) => (
                    <tr key={inv.id}>
                      <td>{formatInvoiceNo(inv.id)}</td>
                      <td>{inv.client?.name}</td>
                      <td className="balance-due">
                        {formatCurrency(inv.balance)}
                      </td>
                      <td>
                        <span className={`status ${inv.status}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      No outstanding invoices
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}