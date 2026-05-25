import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {

  const { user } = useAuth();
  const role = user?.role;

  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    invoices: 0,
    payments: 0,
    balance: 0,
  });

  useEffect(() => {
    if (role) loadStats();
  }, [role]);

  const loadStats = async () => {
    try {

      if (role === "ADMIN") {
        const [clients, products, invoices, payments] = await Promise.all([
          api.get("/admin/clients"),
          api.get("/admin/products"),
          api.get("/accountant/invoices"),
          api.get("/accountant/payments"),
        ]);

        const balance = invoices.data.reduce(
          (sum, i) => sum + (i.balance || 0),
          0
        );

        setStats({
          clients: clients.data.length,
          products: products.data.length,
          invoices: invoices.data.length,
          payments: payments.data.length,
          balance,
        });
      }

      if (role === "ACCOUNTANT") {
        const [invoices, payments] = await Promise.all([
          api.get("/accountant/invoices"),
          api.get("/accountant/payments"),
        ]);

        const balance = invoices.data.reduce(
          (sum, i) => sum + (i.balance || 0),
          0
        );

        setStats({
          clients: 0,
          products: 0,
          invoices: invoices.data.length,
          payments: payments.data.length,
          balance,
        });
      }

      if (role === "CLIENT") {
        const res = await api.get("/client/invoices");

        const balance = res.data.reduce(
          (sum, i) => sum + (i.balance || 0),
          0
        );

        setStats({
          clients: 0,
          products: 0,
          invoices: res.data.length,
          payments: 0,
          balance,
        });
      }

    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };

  return (
    <div className="dashboard-page">   {/* 🔥 Important wrapper */}
      <div className="dashboard">

        <div className="dashboard-header">
          <h1>Welcome back, {user?.username}</h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your billing system
          </p>
        </div>

        <div className="dashboard-grid">

          {role === "ADMIN" && (
            <>
              <StatCard icon="👥" title="Clients" value={stats.clients} />
              <StatCard icon="📦" title="Products" value={stats.products} />
            </>
          )}

          {(role === "ADMIN" || role === "ACCOUNTANT") && (
            <>
              <StatCard icon="📄" title="Invoices" value={stats.invoices} />
              <StatCard icon="💳" title="Payments" value={stats.payments} />
              <StatCard icon="₹" title="Pending Balance" value={stats.balance} highlight />
            </>
          )}

          {role === "CLIENT" && (
            <>
              <StatCard icon="📄" title="My Invoices" value={stats.invoices} />
              <StatCard icon="₹" title="My Balance" value={stats.balance} highlight />
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
const StatCard = ({ icon, title, value, highlight }) => {

  const formattedValue =
    title.toLowerCase().includes("balance")
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)
      : value;

  return (
    <div className={`stat-card ${highlight ? "highlight" : ""}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className="stat-value">
          {formattedValue}
        </div>
      </div>
    </div>
  );
};