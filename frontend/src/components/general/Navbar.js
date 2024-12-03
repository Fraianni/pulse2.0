import React from "react";
import "./Navbar.css";  // Aggiungi il file CSS per la personalizzazione dello stile

const Navbar = ({ activeTab, onTabClick }) => {
  return (
    <div className="navbar">
      <ul className="nav-links">
        <li className={`nav-item ${activeTab === "warehouse" ? "active" : ""}`}>
          <a onClick={() => onTabClick("warehouse")}>Warehouse</a>
        </li>
        <li className={`nav-item ${activeTab === "map" ? "active" : ""}`}>
          <a  onClick={() => onTabClick("map")}>Map Designer</a>
        </li>
        {/* <li className="nav-item" onClick={() => onTabClick("login")}>
          <a href="/logout">Logout</a>
        </li> */}
      </ul>
    </div>
  );
};

export default Navbar;
