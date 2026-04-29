import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";

interface ResumeTemplateCard {
  template_id: string;
  name: string;
  description: string;
  price: number;
}

const Dashboard = () => {
  const [templates, setTemplates] = useState<ResumeTemplateCard[]>([]);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  // Add to cart: use context, which syncs with backend
  const handleAddToCart = (template: ResumeTemplateCard) => {
    addToCart(template);
  };

  useEffect(() => {
    fetch("/resume-templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

  return (
    <div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          background: "#185a9d",
          color: "#fff",
          padding: "1rem 2rem",
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
          <a href="/home" style={{ color: "#fff", textDecoration: "none" }}>
            Home
          </a>
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
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {templates.map((t) => {
            const inCart = cart.some(
              (item) => item.template_id === t.template_id
            );
            return (
              <div
                key={t.template_id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(60,60,130,0.10)",
                  padding: 24,
                  minWidth: 260,
                  maxWidth: 320,
                  margin: 12,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: "1px solid #e0e7ef",
                  textAlign: "left",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleAddToCart(t)}
                  disabled={inCart}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: "10px 0",
                    fontSize: 16,
                    fontWeight: 600,
                    color: inCart ? "#fff" : "#185a9d",
                    background: inCart ? "#43cea2" : "#e0e7ef",
                    border: "none",
                    borderRadius: 8,
                    cursor: inCart ? "default" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  aria-label={inCart ? "Carted" : "Add to cart"}
                >
                  {inCart ? "In Cart" : "Add to Cart"}
                </button>
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
                <div
                  style={{
                    marginTop: 16,
                    textAlign: "right",
                    display: "flex",
                    gap: 16,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      color: "#185a9d",
                      textDecoration: "underline",
                      fontWeight: 500,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: "inherit",
                    }}
                    onClick={() => navigate(`/template/${t.template_id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/template/${t.template_id}`);
                      }
                    }}
                    tabIndex={0}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    style={{
                      color: "#fff",
                      background:
                        "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 18px",
                      fontWeight: 600,
                      fontSize: "inherit",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() =>
                      navigate("/checkout", {
                        state: { template: t },
                      })
                    }
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
