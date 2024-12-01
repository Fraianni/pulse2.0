import React, { useState } from "react";
import "./App.css";
import WarehouseDashboard from "./components/warehouse/WarehouseDashboard";
import MapDesigner from "./components/map/MapDesigner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [activeTab, setActiveTab] = useState("warehouse");

  return (
    <div className="App">
      <header>
        <button onClick={() => setActiveTab("warehouse")}>Magazzino</button>
        <button onClick={() => setActiveTab("map")}>Mappa del Locale</button>
      </header>

      <main>
        {activeTab === "warehouse" && <WarehouseDashboard />}
        {activeTab === "map" && (
          <DndProvider backend={HTML5Backend}>
            <MapDesigner />
          </DndProvider>
        )}
      </main>
    </div>
  );
}

export default App;
