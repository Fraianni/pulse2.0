import React, { useState } from "react";
import "./App.css";
import WarehouseDashboard from "./components/warehouse/WarehouseDashboard";
import MapDesigner from "./components/map/MapDesigner";
import { DndProvider } from "react-dnd";
import { MultiBackend, TouchTransition } from "dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

// Configurazione backend: Mouse (HTML5) e Touch
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend, // Supporto per mouse
    },
    {
      backend: TouchBackend,
      preview: true, // Abilita anteprima per oggetti trascinati
      transition: TouchTransition, // Gestione transizioni per touch
    },
  ],
};

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
          <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <MapDesigner />
          </DndProvider>
        )}
      </main>
    </div>
  );
}

export default App;
