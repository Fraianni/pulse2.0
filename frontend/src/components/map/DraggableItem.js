import React, { useState } from "react";
import { useDrag } from "react-dnd";
import './DraggableItem.css';
import { FaRedo } from 'react-icons/fa';

const DraggableItem = ({
  id, 
  typeTag, 
  type, 
  x, 
  y, 
  color, 
  onClick, 
  className, 
  rotation, 
  onDoubleClick,
  width,
  height
}) => {
  const [dummyWidth, setDummyWidth] = useState(width); // Usa la larghezza iniziale passata come prop
  const [dummyHeight, setDummyHeight] = useState(height); // Usa l'altezza iniziale passata come prop
  const [dragging, setDragging] = useState(false);
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const [, dragRef] = useDrag({
    type: "ITEM",
    item: { id, type, isNew: false },
  });

  const handleResize = (e) => {
    if (resizeStart.x && resizeStart.y) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      setDummyWidth(resizeStart.width + deltaX);
      setDummyHeight(resizeStart.height + deltaY);
    }
  };

  const startResize = (e) => {
    setResizeStart({
      width: width,
      height: height,
      x: e.clientX,
      y: e.clientY,
    });
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
  };

  // Funzione per determinare se il contenuto del testo è troppo lungo
  const isTextOverflowing = (element) => {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
  };

  return (
    <div
      className={className}
      onDoubleClick={onDoubleClick}
      ref={dragRef}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: dragging ? "grabbing" : "move",
        transform: `rotate(${rotation}deg)`, 
        transition: "transform 0.2s ease", 
        backgroundColor: color || "lightblue", 
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
        width: `${width}px`, 
        height: `${height}px`,
        resize: "both", // Abilita il ridimensionamento manuale
        overflow: "hidden", // Nasconde il contenuto che esce dai limiti
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
          top: "-20",
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
      
      {/* Contenuto principale */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textOverflow: "ellipsis", 
          overflow: "hidden", // Limita l'overflow orizzontale
          whiteSpace: "nowrap", // Previene l'andare a capo del testo
          width: "100%",
          height: "100%",
        }}
        ref={(el) => {
          if (el && isTextOverflowing(el)) {
            // Adatta la dimensione del contenitore se il testo è troppo lungo
            setDummyWidth(el.scrollWidth);
            setDummyHeight(el.scrollHeight);
          }
        }}
      >
        {type}
      </div>

      {/* Resizer per il ridimensionamento */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "15px",
          height: "15px",
          cursor: "se-resize",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        onMouseDown={startResize} 
      ></div>
    </div>
  );
};

export default DraggableItem;
