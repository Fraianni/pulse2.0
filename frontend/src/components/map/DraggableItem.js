import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ id, type, x, y }) => {
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
        backgroundColor: "lightblue",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
      }}
    >
      {type}
    </div>
  );
};

export default DraggableItem;
