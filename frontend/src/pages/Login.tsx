import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend API to login user
    // On success:
    navigate("/dashboard");
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="full-width-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
