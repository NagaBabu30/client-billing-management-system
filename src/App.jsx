import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./auth/Login";
import ResetPassword from "./pages/auth/ResetPassword"; // ✅ NEW

import Dashboard from "./pages/dashboard/Dashboard";
import Clients from "./pages/clients/Clients";
import Products from "./pages/products/Products";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import Invoices from "./pages/invoices/Invoices";
import InvoiceView from "./pages/invoices/InvoiceView";
import Payments from "./pages/payments/Payments";
import PayInvoice from "./pages/invoices/PayInvoice";

import Chat from "./pages/chat/Chat"; // ✅ AI CHAT

export default function App() {
return ( <Routes>

```
  {/* 🌍 PUBLIC ROUTES */}
  <Route path="/login" element={<Login />} />
  <Route path="/reset-password" element={<ResetPassword />} />

  {/* 🔐 AUTHENTICATED LAYOUT */}
  <Route
    element={
      <ProtectedRoute roles={["ADMIN", "ACCOUNTANT", "CLIENT"]}>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route path="/" element={<Dashboard />} />

    {/* 🤖 AI CHAT */}
    <Route
      path="/chat"
      element={
        <ProtectedRoute roles={["ADMIN", "ACCOUNTANT", "CLIENT"]}>
          <Chat />
        </ProtectedRoute>
      }
    />

    {/* 👑 ADMIN ONLY */}
    <Route
      path="/clients"
      element={
        <ProtectedRoute roles={["ADMIN"]}>
          <Clients />
        </ProtectedRoute>
      }
    />

    <Route
      path="/products"
      element={
        <ProtectedRoute roles={["ADMIN"]}>
          <Products />
        </ProtectedRoute>
      }
    />

    {/* 👨‍💼 ADMIN + ACCOUNTANT */}
    <Route
      path="/invoice/new"
      element={
        <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
          <CreateInvoice />
        </ProtectedRoute>
      }
    />

    {/* 📄 ALL ROLES – INVOICES */}
    <Route
      path="/invoices"
      element={
        <ProtectedRoute roles={["ADMIN", "ACCOUNTANT", "CLIENT"]}>
          <Invoices />
        </ProtectedRoute>
      }
    />

    <Route
      path="/invoices/view/:id"
      element={
        <ProtectedRoute roles={["ADMIN", "ACCOUNTANT", "CLIENT"]}>
          <InvoiceView />
        </ProtectedRoute>
      }
    />

    {/* 💰 PAYMENT HISTORY */}
    <Route
      path="/payments"
      element={
        <ProtectedRoute roles={["ADMIN", "ACCOUNTANT", "CLIENT"]}>
          <Payments />
        </ProtectedRoute>
      }
    />

    {/* 👤 CLIENT ONLY – PAY */}
    <Route
      path="/payments/pay/:id"
      element={
        <ProtectedRoute roles={["CLIENT"]}>
          <PayInvoice />
        </ProtectedRoute>
      }
    />
  </Route>

</Routes>

);
}


