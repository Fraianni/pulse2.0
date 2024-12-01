import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";  // Importazione di Toolbar
import DraggableItem from "./DraggableItem"; // Assicurati che ci sia questo componente

const MapDesigner = () => {
  const [objects, setObjects] = useState([]);

  const [, dropRef] = useDrop({
    accept: "ITEM",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset(); // Recupera la posizione del mouse
      const containerRect = monitor.getSourceClientOffset(); // Posizione del contenitore

      if (offset && containerRect) {
        // Aggiungi un nuovo oggetto solo se l'oggetto non è già nella mappa
        const existingObjectIndex = objects.findIndex((obj) => obj.type === item.type);
        
        // Se l'oggetto è già presente, sposta quello esistente
        if (existingObjectIndex !== -1) {
          const updatedObjects = [...objects];
          updatedObjects[existingObjectIndex] = {
            ...updatedObjects[existingObjectIndex],
            x: offset.x - containerRect.x,
            y: offset.y - containerRect.y,
          };
          setObjects(updatedObjects);
        } else {
          // Se non esiste, crea un nuovo oggetto
          setObjects((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: item.type,
              x: offset.x - containerRect.x,
              y: offset.y - containerRect.y,
            },
          ]);
        }
      }
    },
  });

  // Funzione per gestire lo spostamento degli oggetti esistenti
  const moveObject = (id, x, y) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, x, y } : obj
      )
    );
  };

  return (
    <div>
      {/* Toolbar per la gestione degli oggetti da aggiungere */}
      <Toolbar />
      <div
        ref={dropRef}
        style={{
          width: "800px",
          height: "500px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          position: "relative",
          margin: "20px auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {objects.map((obj) => (
          <DraggableItem
            key={obj.id}
            id={obj.id}
            type={obj.type}
            x={obj.x}
            y={obj.y}
            moveObject={moveObject}  // Passa la funzione per spostare l'oggetto
          />
        ))}
      </div>
    </div>
  );
};

export default MapDesigner;
