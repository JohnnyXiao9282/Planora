import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    fetch("/resume-templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

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
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {templates.map((t) => (
            <button
              key={t.template_id}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(60,60,130,0.10)",
                padding: 24,
                minWidth: 260,
                maxWidth: 320,
                margin: 12,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                border: "1px solid #e0e7ef",
                textAlign: "left",
              }}
              onClick={() => navigate(`/template/${t.template_id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/template/${t.template_id}`);
              }}
              tabIndex={0}
              type="button"
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
              <div style={{ marginTop: 16, textAlign: "right" }}>
                <span
                  style={{
                    color: "#185a9d",
                    textDecoration: "underline",
                    fontWeight: 500,
                  }}
                >
                  View
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
