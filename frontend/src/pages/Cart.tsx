import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { cart } = useCart();

  return (
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
        <span
          style={{ fontWeight: 800, fontSize: "2rem", marginRight: "2rem" }}
        >
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
          <Link to="/home" style={{ color: "#fff", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            to="/dashboard"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Templates
          </Link>
          <Link to="/cart" style={{ color: "#fff", textDecoration: "none" }}>
            Cart
          </Link>
          <Link
            to="/checkout"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Checkout
          </Link>
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
            Profile
          </Link>
        </div>
      </nav>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          minHeight: "70vh",
          marginLeft: 60,
          marginTop: 40,
        }}
      >
        <h2 style={{ fontSize: 32, margin: "0 0 1rem 0" }}>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {cart.map((t) => (
              <div
                key={t.template_id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(60,60,130,0.10)",
                  padding: 24,
                  minWidth: 260,
                  maxWidth: 320,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: "1px solid #e0e7ef",
                  textAlign: "left",
                }}
              >
                <h2 style={{ fontSize: 22, marginBottom: 8 }}>{t.name}</h2>
                <p style={{ color: "#666", minHeight: 48 }}>{t.description}</p>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#43cea2",
                    fontSize: 18,
                    marginTop: 12,
                  }}
                >
                  ${t.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
