import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";


const Cart: React.FC = () => {
  const { cart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleSelectItem = (template_id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(template_id)) {
        newSet.delete(template_id);
      } else {
        newSet.add(template_id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.template_id)));
    }
  };

  const handleCheckout = () => {
    // Optionally, you can pass selected items via state or context
    navigate('/checkout');
  };

  const totalPrice = cart
    .filter((item) => selectedItems.has(item.template_id))
    .reduce((sum, item) => sum + item.price, 0);

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
          paddingBottom: selectedItems.size > 0 ? "120px" : "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "900px",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: 32, margin: 0 }}>Your Cart</h2>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: 600,
                color: "#fff",
                background:
                  selectedItems.size === cart.length
                    ? "#666"
                    : "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {selectedItems.size === cart.length ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>
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
                  boxShadow: selectedItems.has(t.template_id)
                    ? "0 4px 20px rgba(67, 206, 162, 0.4)"
                    : "0 2px 12px rgba(60,60,130,0.10)",
                  padding: 24,
                  minWidth: 260,
                  maxWidth: 320,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: selectedItems.has(t.template_id)
                    ? "2px solid #43cea2"
                    : "1px solid #e0e7ef",
                  textAlign: "left",
                  transition: "all 0.3s ease",
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
                    marginBottom: 16,
                  }}
                >
                  ${t.price}
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectItem(t.template_id)}
                  style={{
                    padding: "10px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#fff",
                    background: selectedItems.has(t.template_id)
                      ? "#43cea2"
                      : "#185a9d",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                  }}
                >
                  {selectedItems.has(t.template_id) ? "✓ Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      {selectedItems.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#fff",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
            padding: "20px 60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 600 }}>
            <span style={{ color: "#666" }}>Selected: {selectedItems.size} item(s)</span>
            <span style={{ marginLeft: "30px", color: "#43cea2", fontSize: "24px" }}>
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            style={{
              padding: "14px 40px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(67, 206, 162, 0.3)",
            }}
          >
            Checkout Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
