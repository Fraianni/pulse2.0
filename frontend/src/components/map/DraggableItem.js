import React from "react";
import { useDrag } from "react-dnd";
import './DraggableItem.css'

const DraggableItem = ({ id, type, x, y, color, onClick, className, rotation, onDoubleClick }) => {
  const [, dragRef] = useDrag({
    type: "ITEM",
    item: { id, type, isNew: false }, // Specifica che non è un nuovo elemento
  });

  return (
    <div 
      className={className}
      onDoubleClick={onDoubleClick} // Aggiungi l'evento di doppio clic
      ref={dragRef}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: "move",
        transform: `rotate(${rotation}deg)`, // Aggiungi la rotazione
        transition: "transform 0.2s ease", // Aggiungi una transizione morbida per la rotazione
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
