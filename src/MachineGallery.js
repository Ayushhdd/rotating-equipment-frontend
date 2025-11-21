import React from "react";
import "./MachineGallery.css";

function MachineGallery() {
  const items = [
  { label: "Turning", img: "/assets/machines/turning.jpg" },
  { label: "Milling", img: "/assets/machines/milling.jpg" },
];



  return (
    <div className="card machine-gallery">
      <div className="card-header">
        <h2>Common Rotating Equipment</h2>
        <p className="card-subtitle">
          Examples of industrial machines where fault diagnosis is essential.
        </p>
      </div>
      <div className="machine-grid">
        {items.map((item, i) => (
          <div key={i} className="machine-box">
            <div
            className="machine-img"
            style={{ backgroundImage: `url("${item.img}")` }}
/>

            <div className="machine-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MachineGallery;
