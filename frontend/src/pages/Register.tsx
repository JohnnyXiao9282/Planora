import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend API to register user
    // On success:
    navigate("/login");
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="full-width-btn" type="submit">
          Register
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
        <span style={{ color: "#6a7a90", fontSize: "0.98rem" }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#5b8def",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </a>
        </span>
      </div>
    </div>
  );
};

export default Register;
