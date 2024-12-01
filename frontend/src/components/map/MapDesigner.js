import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableItem from "./DraggableItem";

const MapDesigner = () => {
  const [objects, setObjects] = useState([]);

  const [, dropRef] = useDrop({
    accept: "ITEM",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const { id, type, isNew } = item;

      if (isNew) {
        // Aggiungi un nuovo oggetto
        setObjects((prev) => [
          ...prev,
          {
            id: Date.now(),
            type,
            x: offset.x,
            y: offset.y,
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
          />
        ))}
      </div>
    </div>
  );
};

export default MapDesigner;
