import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { formatTemplateName } from "../utils/formatTemplateName";

interface Purchase {
  templates: { template_id: string; name: string; price: number }[];
  total: number;
  purchased_at?: string | null;
}

const PurchaseHistory = () => {
  // Only reachable via the "View Purchase History" button on Checkout
  const fromCheckout = !!useLocation().state?.fromCheckout;
  const [history, setHistory] = useState<Purchase[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fromCheckout) return;
    fetch("http://localhost:5050/purchase-history", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() =>
        setError("Couldn't load purchase history. Is the backend running?")
      );
  }, [fromCheckout]);

  if (!fromCheckout) return <Navigate to="/checkout" replace />;

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
          gap: "1.5rem",
          padding: "1.2rem 2rem",
          background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
          color: "#fff",
          fontSize: "1.1rem",
        }}
      >
        <span
          style={{ fontWeight: 800, fontSize: "2rem", marginRight: "1.5rem" }}
        >
          Planora
        </span>
        {[
          ["/dashboard", "Templates"],
          ["/cart", "Cart"],
          ["/checkout", "Checkout"],
          ["/profile", "Profile"],
        ].map(([to, label]) => (
          <Link
            key={to}
            to={to}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            {label}
          </Link>
        ))}
      </nav>
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ color: "#1d2b4f" }}>Purchase History</h1>
        {error && <p>{error}</p>}
        {!error && history === null && <p>Loading…</p>}
        {history?.length === 0 && (
          <p>
            No purchases yet. Browse <Link to="/dashboard">templates</Link> to
            get started.
          </p>
        )}
        {history?.map((p, i) => (
          <div
            key={`${p.purchased_at ?? ""}-${i}`}
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(60,60,130,0.10)",
              padding: 24,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#5b6475",
                marginBottom: 8,
              }}
            >
              <span>
                {p.purchased_at
                  ? new Date(p.purchased_at).toLocaleString()
                  : "Earlier purchase"}
              </span>
              <span style={{ fontWeight: 700, color: "#43cea2", fontSize: 18 }}>
                ${p.total.toFixed(2)}
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {p.templates.map((t) => (
                <li
                  key={t.template_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "8px 0",
                    borderTop: "1px solid #eef2f7",
                  }}
                >
                  <Link
                    to={`/template/${t.template_id}`}
                    style={{ color: "#185a9d", overflowWrap: "anywhere" }}
                  >
                    {formatTemplateName(t.name)}
                  </Link>
                  <span>${t.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PurchaseHistory;
