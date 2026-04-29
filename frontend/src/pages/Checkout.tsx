import { useCart } from "../context/CartContext";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Checkout: React.FC = () => {
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // If coming from Buy Now, location.state.template will be set
  let selectedTemplates = [];
  if (location.state?.template) {
    selectedTemplates = [location.state.template];
  } else {
    const selectedIds: string[] =
      location.state?.selectedIds || cart.map((t) => t.template_id);
    selectedTemplates = cart.filter((t) => selectedIds.includes(t.template_id));
  }
  const total = selectedTemplates.reduce((sum, t) => sum + t.price, 0);

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
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "70vh",
          marginLeft: 60,
          marginTop: 40,
        }}
      >
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(60,60,130,0.10)",
            padding: 32,
          }}
        >
          <h2 style={{ fontSize: 32, marginBottom: 24 }}>Order Summary</h2>
          {selectedTemplates.length === 0 ? (
            <p>No templates selected for checkout.</p>
          ) : (
            <>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {selectedTemplates.map((t) => (
                  <li
                    key={t.template_id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #e0e7ef",
                      padding: "16px 0",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 20 }}>
                        {t.name}
                      </div>
                      <div style={{ color: "#666", fontSize: 15 }}>
                        {t.description}
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#43cea2",
                        fontSize: 20,
                      }}
                    >
                      ${t.price.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 32,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span style={{ color: "#43cea2", fontSize: 28 }}>
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => alert("Purchase complete! (demo)")}
                style={{
                  marginTop: 32,
                  width: "100%",
                  padding: "16px 0",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(67, 206, 162, 0.2)",
                }}
              >
                Confirm Purchase
              </button>
            </>
          )}
        </div>
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            margin: "32px auto 0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/profile")}
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: 17,
              fontWeight: 600,
              color: "#185a9d",
              background: "#e0e7ef",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            View Purchase History
          </button>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
