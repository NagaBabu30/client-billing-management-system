import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./invoices.css";

import { getInvoices as getAccInvoices } from "../../api/accountant/invoiceApi";
import { getMyInvoices } from "../../api/client/invoiceApi";
import { deleteInvoice } from "../../api/admin/invoiceApi";

import { FiEye, FiCreditCard, FiTrash2 } from "react-icons/fi";

export default function Invoices() {

  const { user } = useAuth();
  const role = user?.role?.replace("ROLE_", "");
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (role) loadInvoices();
  }, [role]);

  useEffect(() => {
    applyFilters();
  }, [search, status, invoices]);

  const loadInvoices = async () => {
    const res =
      role === "CLIENT"
        ? await getMyInvoices()
        : await getAccInvoices();

    setInvoices(res.data);
    setFilteredInvoices(res.data);
  };

  const applyFilters = () => {
    let data = [...invoices];

    if (search) {
      data = data.filter(inv =>
        `INV-${inv.id}`.toLowerCase().includes(search.toLowerCase()) ||
        inv.client?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      data = data.filter(inv => inv.status === status);
    }

    setFilteredInvoices(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await deleteInvoice(id);
      loadInvoices();
    } catch {
      alert("Cannot delete invoice");
    }
  };

return (

  <div className="invoices-page">

    {/* ✅ NEW CARD WRAPPER ADDED */}
    <div className="invoices-card">

      {/* HEADER */}
      <div className="page-header">
        <h2>Invoices</h2>
        <p className="page-subtitle">
          Manage and track all invoices
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">

        <div className="search-box">
          <span className="search-icon">🔍</span>

          <input
            className="search-input"
            placeholder="Search Invoice / Client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PARTIAL">Partial</option>
        </select>

      </div>

      {/* TABLE CONTAINER */}
      <div className="table-container">

        <table className="invoices-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredInvoices.length === 0 ? (

              <tr>
                <td colSpan="7" className="no-data">
                  No invoices found
                </td>
              </tr>

            ) : (

              filteredInvoices.map((inv) => (

                <tr key={inv.id}>

                  <td>INV-{inv.id}</td>
                  <td>{inv.client?.name || "-"}</td>
                  <td>{inv.issueDate}</td>
                  <td>{inv.dueDate}</td>
                  <td>₹ {Number(inv.totalAmount).toLocaleString("en-IN")}</td>

                  <td>
                    <span className={`status ${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>

                  <td className="actions">

                    <button
                      className="icon-btn view-btn"
                      onClick={() =>
                        navigate(`/invoices/view/${inv.id}`)
                      }
                    >
                      <FiEye size={16}/>
                    </button>

                    {role === "CLIENT" && inv.balance > 0 && (
                      <button
                        className="icon-btn pay-btn"
                        onClick={() =>
                          navigate(`/payments/pay/${inv.id}`)
                        }
                      >
                        <FiCreditCard size={16}/>
                      </button>
                    )}

                    {role === "ADMIN" &&
                      inv.status === "UNPAID" && (
                        <button
                          className="icon-btn delete-btn"
                          onClick={() =>
                            handleDelete(inv.id)
                          }
                        >
                          <FiTrash2 size={16}/>
                        </button>
                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div> {/* ✅ invoices-card */}

  </div>

);
}
