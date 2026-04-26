import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Dashboard: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(120deg, #e0e7ef 0%, #b6c6e6 100%)" }}>
      <nav style={{
        display: "flex",
        alignItems: "center",
        padding: "1.5rem 2rem 1rem 2rem",
        background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "1.7rem",
        letterSpacing: "1px"
      }}>
        <span style={{ fontWeight: 800, fontSize: "2rem", marginRight: "2rem" }}>Planora</span>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "1.1rem" }}>
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Templates</Link>
          <Link to="/cart" style={{ color: "#fff", textDecoration: "none" }}>Cart</Link>
          <Link to="/checkout" style={{ color: "#fff", textDecoration: "none" }}>Checkout</Link>
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>Profile</Link>
        </div>
      </nav>
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: "2.5rem 0 1.5rem 0", color: "#2d3a4a" }}>
          Welcome to <span style={{ color: "#43cea2" }}>Planora</span> Template Marketplace!
        </h1>
        <p style={{ fontSize: "1.3rem", color: "#444", marginBottom: "2rem" }}>
          Browse professional templates, add to your cart, and checkout easily.
        </p>
        {/* Add more dashboard content here */}
      </main>
    </div>
  );
};

export default Dashboard;
