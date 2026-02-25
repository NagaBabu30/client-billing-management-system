import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

// ADMIN APIs
import { getClients } from "../../api/admin/clientApi";
import { getProducts } from "../../api/admin/productApi";

// ACCOUNTANT APIs
import { getAccClients } from "../../api/accountant/clientApi";
import { getAccProducts } from "../../api/accountant/productApi";

import { createInvoice } from "../../api/accountant/invoiceApi";
import "./CreateInvoice.css";

export default function CreateInvoice() {
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { productId: "", price: 0, tax: 0, discount: 0, quantity: 1 }
  ]);

  useEffect(() => {
    if (user?.role) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      if (user.role === "ADMIN") {
        const c = await getClients();
        const p = await getProducts();
        setClients(c.data);
        setProducts(p.data);
      } else if (user.role === "ACCOUNTANT") {
        const c = await getAccClients();
        const p = await getAccProducts();
        setClients(c.data);
        setProducts(p.data);
      }
    } catch (err) {
      alert("Failed to load clients/products");
    }
  };

  const handleProductChange = (index, productId) => {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: Number(productId),
      price: product.price,
      tax: product.tax,
      discount: product.discount
    };
    setItems(newItems);
  };

  const handleQtyChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = Number(qty);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", price: 0, tax: 0, discount: 0, quantity: 1 }
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateItemTotal = (i) => {
    const base = i.price * i.quantity;
    const discountAmt = (base * i.discount) / 100;
    const taxable = base - discountAmt;
    const taxAmt = (taxable * i.tax) / 100;
    return taxable + taxAmt;
  };

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity, 0
  );

  const totalDiscount = items.reduce(
    (sum, i) => sum + (i.price * i.quantity * i.discount) / 100, 0
  );

  const totalTax = items.reduce((sum, i) => {
    const taxable =
      (i.price * i.quantity) -
      (i.price * i.quantity * i.discount) / 100;
    return sum + (taxable * i.tax) / 100;
  }, 0);

  const grandTotal = subtotal - totalDiscount + totalTax;

  const submitInvoice = async () => {
    if (!clientId) return alert("Select client");

    for (let i of items) {
      if (!i.productId) {
        return alert("Select product for all rows");
      }
    }

    const payload = {
      clientId: Number(clientId),
      items: items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };

    try {
      setLoading(true);
      await createInvoice(payload);
      alert("Invoice created successfully");

      setClientId("");
      setItems([{ productId: "", price: 0, tax: 0, discount: 0, quantity: 1 }]);
    } catch (err) {
      alert("Invoice creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice-page">
      <h2>Create Invoice</h2>

      <select value={clientId} onChange={e => setClientId(e.target.value)}>
        <option value="">Select Client</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Disc %</th>
            <th>Tax %</th>
            <th>Qty</th>
            <th>Item Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td title={products.find(p => p.id === it.productId)?.name}>
                <select
                  value={it.productId}
                  onChange={e => handleProductChange(i, e.target.value)}
                >
                  <option value="">Select</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} title={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>

              <td>{it.price}</td>
              <td>{it.discount}</td>
              <td>{it.tax}</td>

              <td>
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={e => handleQtyChange(i, e.target.value)}
                />
              </td>

              <td>{calculateItemTotal(it).toFixed(2)}</td>

              <td>
                {items.length > 1 && (
                  <button
                    className="delete-btn"
                    onClick={() => removeItem(i)}
                  >
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Added proper class */}
      <button className="add-product-btn" onClick={addItem}>
        + Add Product
      </button>

      <div className="invoice-summary">
        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <p>Discount: ₹ {totalDiscount.toFixed(2)}</p>
        <p>Tax: ₹ {totalTax.toFixed(2)}</p>
        <h3>Grand Total: ₹ {grandTotal.toFixed(2)}</h3>
      </div>

      {/* ✅ Added proper class */}
      <button
        className="create-invoice-btn"
        onClick={submitInvoice}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </div>
  );
}
