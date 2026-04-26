import React from "react";

const Home: React.FC = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #e0e7ef 0%, #b6c6e6 100%)",
    }}
  >
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1.5rem 2rem 1rem 2rem",
        background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "1.7rem",
        letterSpacing: "1px",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: "2rem", marginRight: "2rem" }}>
        Planora
      </span>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          fontSize: "1.1rem",
          marginLeft: "2rem",
          marginTop: "1.2rem",
        }}
      >
        <a href="/home" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </a>
        <a href="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
          Templates
        </a>
        <a href="/cart" style={{ color: "#fff", textDecoration: "none" }}>
          Cart
        </a>
        <a href="/checkout" style={{ color: "#fff", textDecoration: "none" }}>
          Checkout
        </a>
        <a href="/profile" style={{ color: "#fff", textDecoration: "none" }}>
          Profile
        </a>
      </div>
    </nav>
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          margin: "2.5rem 0 1.5rem 0",
          color: "#2d3a4a",
        }}
      >
        Welcome to <span style={{ color: "#43cea2" }}>Planora</span> Template
        Marketplace!
      </h1>
      <p style={{ fontSize: "1.3rem", color: "#444", marginBottom: "2rem" }}>
        Browse professional templates, add to your cart, and checkout easily.
      </p>
    </main>
  </div>
);

export default Home;
