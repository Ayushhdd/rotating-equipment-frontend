import React from "react";
import "./MachineGallery.css";

function MachineGallery() {
  const items = [
    { label: "Turning Center", img: "/assets/machines/turning.jpg" },
    { label: "CNC Milling Machine", img: "/assets/machines/milling.jpg" },
    { label: "CNC Machining Center", img: "/assets/machines/cnc.png" },
    { label: "Drilling Machine", img: "/assets/machines/drilling.png" },
  ];




  return (
    <div className="card machine-gallery">
      <div className="card-header">
       
      <h2>Rotating Equipment in Industry</h2>
<p className="card-subtitle">
  Typical machines where vibration–based fault diagnosis and predictive maintenance are applied.
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
