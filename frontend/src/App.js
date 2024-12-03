import React, { useEffect, useState } from "react";
import "./App.css";
import WarehouseDashboard from "./components/warehouse/WarehouseDashboard";
import MapDesigner from "./components/map/MapDesigner";
import { DndProvider } from "react-dnd";
import { MultiBackend, TouchTransition } from "dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ApolloProvider } from "@apollo/client";
import { warehouseClient, mapdesignerClient, authenticationClient } from "./ApolloClient";
import AuthenticationController from "./AuthenticationController";
import Navbar from "./components/general/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer e toast
import 'react-toastify/dist/ReactToastify.css'; // Importa lo stile dei toast
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
    },
    {
      backend: TouchBackend,
      preview: true,
      transition: TouchTransition,
    },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
  };

  const dummyTokenAuthentication = () => {
    if (token){
      setIsLoggedIn(true);
    }
  }

  useEffect(() => {
    dummyTokenAuthentication();
  }, []); // L'array vuoto fa sì che venga eseguito solo una volta al montaggio del componente


  return (
    <div className="App">
      <ToastContainer/>
      <Navbar activeTab={activeTab} onTabClick={handleNavigation} />

      {isLoggedIn ? (
        <>
          <main>
            {activeTab === "warehouse" && (
              <ApolloProvider client={warehouseClient}>
                <WarehouseDashboard />
              </ApolloProvider>
            )}
            {activeTab === "map" && (
              <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ApolloProvider client={mapdesignerClient}>
                  <MapDesigner />
                </ApolloProvider>
              </DndProvider>
            )}
          </main>
        </>
      ) : (
        <ApolloProvider client={authenticationClient}>
          <AuthenticationController />
        </ApolloProvider>
      )}
    </div>
  );
}

export default App;
