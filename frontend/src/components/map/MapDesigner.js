import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableItem from "./DraggableItem";

const MapDesigner = () => {
  const [objects, setObjects] = useState([]);

  const dropRef = useRef(null);  // Usa useRef per il contenitore del drop

  const [, drop] = useDrop({
    accept: "ITEM",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      console.log("Offset", offset);
      const { id, type, isNew } = item;
      const containerRect = dropRef.current.getBoundingClientRect();  // Usa il riferimento per ottenere la posizione del contenitore

      if (isNew) {
        const xnewItem = offset.x - containerRect.left;
        const ynewItem = offset.y - containerRect.top;
        
        // Aggiungi un nuovo oggetto
        setObjects((prev) => [
          ...prev,
          {
            id: Date.now(),
            type,
            x: xnewItem,
            y: ynewItem,
          },
        ]);
      } else {
        // Aggiorna la posizione di un oggetto esistente
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          setObjects((prevObjects) =>
            prevObjects.map((obj) =>
              obj.id === id
                ? {
                    ...obj,
                    x: obj.x + delta.x,
                    y: obj.y + delta.y,
                  }
                : obj
            )
          );
        }
      }
    },
  });

  return (
    <div>
      <Toolbar />
      <div
        ref={(node) => {
          dropRef.current = node;  // Assegna il riferimento dell'elemento DOM
          drop(node);  // Passa il nodo a dropRef per il monitoraggio
        }}
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
          />
        ))}
      </div>
    </div>
  );
};

export default MapDesigner;
