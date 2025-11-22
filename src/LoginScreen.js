// src/LoginScreen.js
import React, { useState } from "react";
import "./App.css"; // reuse same theme

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple dummy check – change if you want real auth
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // you can replace this with real API call later
    setError("");
    onLogin();
  };

 return (
  <div className="login-root">
    <div className="login-card">
      <div className="login-left">
  <div className="login-header-row">
    <div className="login-brand">
      <img
        src="/logo.png"
        alt="REFD logo"
        className="login-logo-icon"
      />
      <span className="login-logo-text">REFD</span>
    </div>

    <div className="app-pill">• Rotating Equipment</div>
  </div>
  {/* rest stays same */}

        <h1 className="login-title">
          Fault Diagnosis <span className="hero-gradient">Dashboard</span>
        </h1>

          <p className="login-subtitle">
            Sign in to access the predictive maintenance dashboard powered by
            FastAPI, XGBoost and MLP ensemble.
          </p>

          <ul className="login-bullets">
            <li>Real-time fault prediction (Normal / Imbalance / Bearing / Overheating)</li>
            <li>Multi-sensor fusion (Vibration X/Y/Z, Acoustic, Temperature)</li>
            <li>Visualization of confidence trends and recent runs</li>
          </ul>
        </div>

        <div className="login-right">
          <div className="login-panel">
            <h2>Welcome back</h2>
            <p className="login-panel-sub">
              Use demo credentials or your institute email to continue.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="field">
                <span className="field-label">Email</span>
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              {error && <div className="alert error">{error}</div>}

              <button type="submit" className="btn primary login-btn">
                Enter Dashboard
              </button>

            
            </form>
          </div>
        </div>
      </div>

      <div className="login-footer">
        Rotating Equipment Fault Diagnosis • Thapar University • {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default LoginScreen;
