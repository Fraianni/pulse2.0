import React from "react";
import { useDrag } from "react-dnd";
import './DraggableItem.css'
import { FaRedo } from 'react-icons/fa';

const DraggableItem = ({ id, typeTag,type, x, y, color, onClick, className, rotation, onDoubleClick }) => {
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
        {/* Posiziona il typeTag sopra l'elemento */}
      <div 
        style={{
          position: "absolute",
          top: -20, // Posiziona il typeTag sopra l'elemento
          left: "50%",
          transform: "translateX(-50%)", // Centra il tag sopra l'elemento
          fontSize: "12px", // Regola la dimensione del testo
          fontWeight: "bold", // Opzionale, se vuoi che sia in grassetto
          color: "#fff", // Colore del testo (puoi cambiarlo)
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Sfondo semitrasparente per rendere il testo leggibile
          padding: "2px 5px", // Padding per il tag
          borderRadius: "3px", // Opzionale, se vuoi che il tag abbia angoli arrotondati
          zIndex: 10, // Assicurati che il tag sia sopra l'elemento
        }}
      >
        {typeTag}
      </div>
        {type}
      </div>

  );
};

export default DraggableItem;
