// src/App.js
import React, { useState, useRef, useEffect } from "react";
import MachineGallery from "./MachineGallery";
import LoginScreen from "./LoginScreen";
import ChartPanel from "./ChartPanel";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://rotating-backend-1.onrender.com";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);




  // NEW: which tab is active in top nav
  const [activeTab, setActiveTab] = useState("home");

  // NEW: references to sections for smooth scroll
  const homeRef = useRef(null);
  const testingRef = useRef(null);
  const aboutRef = useRef(null);



    // Update active tab when user scrolls (scrollspy)
  useEffect(() => {
    const handleScroll = () => {
      if (!homeRef.current || !testingRef.current || !aboutRef.current) return;

      const offset = 140; // adjust if needed (nav height + some margin)

      const testingTop = testingRef.current.getBoundingClientRect().top;
      const aboutTop = aboutRef.current.getBoundingClientRect().top;

      if (aboutTop <= offset) {
        setActiveTab("about");
      } else if (testingTop <= offset) {
        setActiveTab("testing");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);





  const [form, setForm] = useState({
    vibration_x: "",
    vibration_y: "",
    vibration_z: "",
    acoustic_level: "",
    temperature: "",
  });
  // ...rest of your states stay same


  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      vibration_x: "",
      vibration_y: "",
      vibration_z: "",
      acoustic_level: "",
      temperature: "",
    });
    setError("");
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

      


    try {
      const payload = {
        vibration_x: parseFloat(form.vibration_x),
        vibration_y: parseFloat(form.vibration_y),
        vibration_z: parseFloat(form.vibration_z),
        acoustic_level: parseFloat(form.acoustic_level),
        temperature: parseFloat(form.temperature),
      };

      if (Object.values(payload).some((v) => Number.isNaN(v))) {
        setError("Please enter valid numeric values for all fields.");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/predict`, payload);
      const data = res.data;

      const confidencePercent =
        Math.round((data.probability || 0) * 10000) / 100;

      const enriched = {
        ...data,
        confidencePercent,
        input: payload,
        timestamp: new Date().toLocaleString(),
      };

      setResult(enriched);
      setHistory((prev) => [enriched, ...prev].slice(0, 10));
    } catch (err) {
      console.error(err);
      setError(
        "Error calling prediction API. Check that backend is running and API_BASE_URL is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const faultBadgeClass = (label) => {
    if (!label) return "badge neutral";
    const lower = label.toLowerCase();
    if (lower.includes("normal")) return "badge normal";
    if (lower.includes("imbalance")) return "badge warning";
    if (lower.includes("overheat")) return "badge danger";
    if (lower.includes("bearing")) return "badge danger";
    return "badge neutral";
  };

    const scrollToSection = (section) => {
    setActiveTab(section);

    let ref = null;
    if (section === "home") ref = homeRef;
    if (section === "testing") ref = testingRef;
    if (section === "about") ref = aboutRef;

    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  if (!isAuthenticated) {
  return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
}
   return (
    <div className="app-root" ref={homeRef}>

            {/* TOP NAV BAR */}
      <nav className="top-nav">
        <div className="top-nav-left">
          <div className="nav-logo">
          <img src="/logo.png" alt="logo" className="nav-logo-icon" />
          <span className="nav-logo-text">REFD</span>
          </div>

        </div>
        <div className="top-nav-right">
          <button
            type="button"
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === "testing" ? "active" : ""}`}
            onClick={() => scrollToSection("testing")}
          >
            Testing
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === "about" ? "active" : ""}`}
            onClick={() => scrollToSection("about")}
          >
            About
          </button>
        </div>
      </nav>

      {/* TOP HERO + NAV STRIP */}
      <header className="app-header">

        <div className="app-header-left">
          <div className="app-pill">• Predictive Maintenance</div>
          <h1 className="hero-title">
            Rotating Equipment <span className="hero-gradient">Fault</span>{" "}
            Diagnosis
          </h1>
          <p>
            Detection of {" "}
            <span className="highlight">bearing faults</span>,{" "}
            <span className="highlight">imbalance</span> and{" "}
            <span className="highlight">overheating</span> using sensor fusion
            and an XGBoost + MLP <strong>soft-vote ensemble</strong>.
          </p>
          <div className="tag-row">
            <span className="tag">Multi-sensor fusion (Vib + Acoustic)</span>
            <span className="tag">Time + FFT features (75-D)</span>
            <span className="tag">FastAPI + React</span>
            <span className="tag">Real-time inference</span>
          </div>

          <div className="hero-metrics-row">
            <MetricCard
              label="Test Accuracy"
              value="≈ 80%"
              sub="4-class fault classification"
            />
            <MetricCard
              label="Sensors"
              value="5"
              sub="Vx, Vy, Vz, Acoustic, Temp"
            />
            <MetricCard
              label="Latency"
              value="< 50 ms"
              sub="On single JSON request"
            />
          </div>
        </div>

        <div className="app-header-right">
          <div className="status-card glow">
            <span className="status-dot online" />
            <div>
              <div className="status-title">Model Status</div>
              <div className="status-sub">
                {error
                  ? "API error"
                  : loading
                  ? "Running prediction..."
                  : "Ready"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="scroll-indicator">
        <span className="scroll-text">Scroll to explore dashboard</span>
        <span className="scroll-icon">▿</span>
      </div>

      {/* MAIN DASHBOARD AREA */}
            <main className="app-main">
        {/* LEFT SIDE: FORM + RESULTS */}
        <section className="main-left">
          <div className="card card-animated" ref={testingRef}>
            <div className="card-header">
              <h2>Single Record Prediction</h2>

              <p className="card-subtitle">
                Stream a single time-window of sensor readings to the backend
                and visualize the predicted fault in real time.
              </p>
            </div>

            <form className="grid-form" onSubmit={handleSubmit}>
              <InputField
                label="Vibration X"
                name="vibration_x"
                value={form.vibration_x}
                onChange={handleChange}
                placeholder="e.g. 5.2"
              />
              <InputField
                label="Vibration Y"
                name="vibration_y"
                value={form.vibration_y}
                onChange={handleChange}
                placeholder="e.g. 4.1"
              />
              <InputField
                label="Vibration Z"
                name="vibration_z"
                value={form.vibration_z}
                onChange={handleChange}
                placeholder="e.g. 2.9"
              />
              <InputField
                label="Acoustic Level (dB)"
                name="acoustic_level"
                value={form.acoustic_level}
                onChange={handleChange}
                placeholder="e.g. 220"
              />
              <InputField
                label="Temperature (°C)"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
                placeholder="e.g. 60"
              />

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? "Predicting..." : "Predict Fault"}
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </form>

            {error && <div className="alert error">{error}</div>}
          </div>

          <div className="result-layout">
            {/* CURRENT RESULT CARD */}
            <div className="card result-card card-animated">
              <div className="card-header">
                <h2>Prediction Result</h2>
              </div>
              <ChartPanel history={history} />

              {result ? (
                <div className="result-content">
                  <div className="result-main">
                    <div className="result-label-row">
                      <span className="result-label-title">Fault Label</span>
                      <span className={faultBadgeClass(result.fault_label)}>
                        {result.fault_label}
                      </span>
                    </div>

                    <div className="result-kpis">
                      <div className="kpi">
                        <span className="kpi-label">Fault Code</span>
                        <span className="kpi-value">{result.fault_code}</span>
                      </div>
                      <div className="kpi">
                        <span className="kpi-label">Confidence</span>
                        <span className="kpi-value">
                          {result.confidencePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${Math.min(
                            Math.max(result.confidencePercent, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="small-text muted">
                      Confidence is based on the ensemble of XGBoost and MLP
                      probabilities (soft vote).
                    </p>
                  </div>

                  <div className="result-input-summary">
                    <h3>Input Snapshot</h3>
                    <div className="input-grid">
                      <span>Vx</span>
                      <span>{result.input.vibration_x}</span>
                      <span>Vy</span>
                      <span>{result.input.vibration_y}</span>
                      <span>Vz</span>
                      <span>{result.input.vibration_z}</span>
                      <span>Acoustic</span>
                      <span>{result.input.acoustic_level}</span>
                      <span>Temp (°C)</span>
                      <span>{result.input.temperature}</span>
                    </div>
                    <p className="small-text">
                      You can screenshot this card and directly paste it into
                      your report as an example prediction.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="placeholder-text">
                  Run a prediction to see the ensemble output and confidence
                  visualization here.
                </p>
              )}
            </div>

            {/* HISTORY TABLE */}
            <div className="card history-card card-animated">
              <div className="card-header">
                <h2>Recent Predictions</h2>
                <p className="card-subtitle">
                  Last 10 runs of the model in this browser session.
                </p>
              </div>
              {history.length === 0 ? (
                <p className="placeholder-text">
                  Predictions history will appear here once you start
                  experimenting.
                </p>
              ) : (
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Label</th>
                        <th>Conf.</th>
                        <th>Vx</th>
                        <th>Vy</th>
                        <th>Vz</th>
                        <th>Acoustic</th>
                        <th>Temp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.timestamp}</td>
                          <td>
                            <span
                              className={faultBadgeClass(item.fault_label)}
                            >
                              {item.fault_label}
                            </span>
                          </td>
                          <td>{item.confidencePercent.toFixed(1)}%</td>
                          <td>{item.input.vibration_x}</td>
                          <td>{item.input.vibration_y}</td>
                          <td>{item.input.vibration_z}</td>
                          <td>{item.input.acoustic_level}</td>
                          <td>{item.input.temperature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT SIDE PANEL: OVERVIEW + VIVA NOTES */}
        <aside className="main-right">
          <div className="card info-card card-animated">
            <div className="card-header">
              <h2>Model Overview</h2>
            </div>
            <ul className="info-list">
              <li>
                <span className="info-label">Algorithm</span>
                <span className="info-value">
                  XGBoost + MLP (soft-vote ensemble)
                </span>
              </li>
              <li>
                <span className="info-label">Input Sensors</span>
                <span className="info-value">
                  Vibration X/Y/Z, Acoustic Level, Temperature
                </span>
              </li>
              <li>
                <span className="info-label">Features</span>
                <span className="info-value">
                  Time-domain (mean, RMS, skew, kurtosis, crest factor) + FFT
                  band energies
                </span>
              </li>
              <li>
                <span className="info-label">Target Classes</span>
                <span className="info-value">
                  Bearing Fault, Imbalance, Normal, Overheating
                </span>
              </li>
              <li>
                <span className="info-label">Training Accuracy</span>
                <span className="info-value">≈ 80% (test set)</span>
              </li>
            </ul>
            <p className="small-text">
            

<MachineGallery />

               
            </p>
          </div>
        </aside>
      </main>

            {/* EXTRA SECTIONS TO FORCE SCROLL + MAKE IT LOOK ADVANCED */}
      <section className="page-section architecture-section"
        ref={aboutRef}
      >
        <div className="section-header">
          <h2>System Architecture</h2>

          <p>
            High-level flow from raw rotating equipment sensors to fault
            diagnosis and visualization.
          </p>
        </div>
        <div className="architecture-grid">
          <ArchitectureCard
            title="1. Data Acquisition"
            text="Multi-axis accelerometers + microphone + temperature sensor capture vibration, acoustic and thermal signatures from the rotating equipment."
          />
          <ArchitectureCard
            title="2. Feature Engineering"
            text="Sliding time windows are converted into statistical and FFT band-energy features, resulting in a compact 75-dimensional feature vector."
          />
          <ArchitectureCard
            title="3. Ensemble Inference"
            text="The feature vector is scaled and passed to XGBoost and MLP models. Their output probabilities are averaged (soft vote) to obtain robust fault predictions."
          />
          <ArchitectureCard
            title="4. Dashboard & Monitoring"
            text="Predictions are streamed to this React dashboard, showing fault class, confidence, and a history table for quick diagnosis and report screenshots."
          />
        </div>
      </section>

      <section className="page-section walkthrough-section">
        <div className="section-header">
          <h2>How this Model works (step-by-step)</h2>
      
        </div>
        <ol className="walkthrough-list">
          <li>
            <strong>Step 1:</strong> User enters sensor readings and clicks{" "}
            <em>Predict Fault</em>.
          </li>
          <li>
            <strong>Step 2:</strong> React sends a POST request to the FastAPI
            endpoint <code>/predict</code> with the five sensor values.
          </li>
          <li>
            <strong>Step 3:</strong> FastAPI converts the values into a
            75-dimensional feature vector (time + frequency) and applies the
            scaler.
          </li>
          <li>
            <strong>Step 4:</strong> XGBoost and MLP both output class
            probabilities. Their average decides the final fault label.
          </li>
          <li>
            <strong>Step 5:</strong> The dashboard displays the label, fault
            code, confidence bar, and updates the prediction history table.
          </li>
        </ol>
      </section>

      <footer className="app-footer">
        <span>
          Rotating Equipment Fault Diagnosis • Built with FastAPI, React, XGBoost &amp; MLP
        </span>
        <span className="footer-sub">
          
        </span>
      </footer>
    </div>
  );
}

/* Small presentational components */

function InputField({ label, name, value, onChange, placeholder }) 
{
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type="number"
        step="any"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="field-input"
      />
    </label>
  );
}

function MetricCard({ label, value, sub }) 
{
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}

function ArchitectureCard({ title, text }) 
{
  return (
    <div className="architecture-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;