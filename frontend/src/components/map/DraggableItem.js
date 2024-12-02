import React from "react";
import { useDrag } from "react-dnd";


const DraggableItem = ({ id, type, x, y, color, onClick }) => {
  const [, dragRef] = useDrag({
    type: "ITEM",
    item: { id, type, isNew: false }, // Specifica che non è un nuovo elemento
  });

  return (
    <div
      ref={dragRef}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: "move",
        backgroundColor: color || "lightblue", // Usa il colore passato dal backend o lightblue come default
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
      }}
      onClick={() => {
        console.log("DraggableItem cliccato");
        onClick();
      }}
    >
      {type}
    </div>
  );
};

export default DraggableItem;
