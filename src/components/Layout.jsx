import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}