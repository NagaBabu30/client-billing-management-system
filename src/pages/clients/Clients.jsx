import { useEffect, useState } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/admin/clientApi";

import "./Clients.css";

export default function Clients() {

  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const res = await getClients();
      setClients(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  };

  useEffect(() => {
    const result = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, clients]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    });
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditId(client.id);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      address: client.address,
    });
    setShowModal(true);
  };

  const saveClient = async () => {

    if (!form.name || !form.email || !form.phone) {
      alert("Name, Email, Phone required");
      return;
    }

    setLoading(true);

    try {

      if (editId) {
        await updateClient(editId, form);
      } else {
        await createClient(form);
      }

      await loadClients();
      setShowModal(false);

    } catch {
      alert("Failed to save client");
    }

    setLoading(false);

  };

  const removeClient = async (id) => {

    if (!window.confirm("Delete client?")) return;

    try {
      await deleteClient(id);
      loadClients();
    } catch {
      alert("Delete failed");
    }

  };

  return (

    <div className="clients-page">

      {/* HEADER */}
      <div className="page-header">
        <h2>Clients</h2>
        <p className="page-subtitle">
          Manage your client database
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search clients..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>

        <button
          className="add-btn"
          onClick={openAddModal}
        >
          ➕ Add Client
        </button>

      </div>

      {/* TABLE */}
      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 ? (

              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No clients found
                </td>
              </tr>

            ) : (

              filtered.map((c) => (

                <tr key={c.id}>

                  <td title={c.name}>{c.name}</td>
                  <td title={c.email}>{c.email}</td>
                  <td title={c.phone}>{c.phone}</td>
                  <td title={c.company}>{c.company}</td>
                  <td title={c.address}>{c.address}</td>

                  <td>

                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(c)}
                    >
                      ✏️
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => removeClient(c.id)}
                    >
                      🗑️
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>
              {editId ? "Edit Client" : "Add New Client"}
            </h3>

            <div className="form">

              <div className="input-group">
                <span>👤</span>
                <input
                  name="name"
                  placeholder="Client Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <span>✉️</span>
                <input
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <span>📞</span>
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <span>🏢</span>
                <input
                  name="company"
                  placeholder="Company"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group full">
                <span>📍</span>
                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

            <div className="btn-group">

             <button
               onClick={saveClient}
               disabled={loading}
               className="save-btn"
             >
              {loading ? "Saving..." : "Save Client"}
             </button>

             <button
               className="cancel-btn"
               onClick={() => setShowModal(false)}
             >
              Cancel
             </button>

</div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}