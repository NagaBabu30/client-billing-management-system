import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/admin/productApi";

import { 
  FaBox,
  FaMoneyBillWave,
  FaReceipt,
  FaTag
} from "react-icons/fa";

import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    tax: "",
    discount: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) {
      alert("Name and Price required");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      tax: Number(form.tax || 0),
      discount: Number(form.discount || 0),
    };

    if (editId) {
      await updateProduct(editId, payload);
      setEditId(null);
    } else {
      await createProduct(payload);
    }

    setForm({
      name: "",
      price: "",
      tax: "",
      discount: "",
    });

    setShowModal(false);
    loadProducts();
  };

  const editProduct = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      tax: p.tax ?? 0,
      discount: p.discount ?? 0,
    });
    setShowModal(true);
  };

  const removeProduct = async (id) => {
    if (window.confirm("Delete product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="products-page">

      <h2>Products & Services</h2>

      {/* Toolbar */}
     <div className="toolbar">

     <div className="search-box">
      <span className="search-icon">🔍</span>
    <input
      className="search-input"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    </div>

  <button
    className="btn-primary"
    onClick={() => setShowModal(true)}
  >
    ➕ Add Product
  </button>

</div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>{editId ? "Edit Product" : "Add Product"}</h3>

            <div className="form">

              <div className="input-group">
                <FaBox className="input-icon" />
                <input
                  name="name"
                  placeholder="Product / Service Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <FaMoneyBillWave className="input-icon" />
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <FaReceipt className="input-icon" />
                <input
                  name="tax"
                  type="number"
                  placeholder="Tax %"
                  value={form.tax}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <FaTag className="input-icon" />
                <input
                  name="discount"
                  type="number"
                  placeholder="Discount %"
                  value={form.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="btn-group">

              <button
                onClick={saveProduct}
                className="save-btn"
              >
                {editId ? "Update Product" : "Add Product"}
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

      {/* Table */}
      <div className="table-container">
        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Tax %</th>
              <th>Discount %</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  String(p.price).includes(search)
              )
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>₹ {p.price.toLocaleString("en-IN")}</td>
                  <td>{p.tax}</td>
                  <td>{p.discount}</td>
                  <td className="action-cell">

                    <button
                      className="action-btn edit-btn"
                      onClick={() => editProduct(p)}
                    >
                      ✏️
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => removeProduct(p.id)}
                    >
                      🗑️
                    </button>

                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}