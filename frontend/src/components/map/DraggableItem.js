import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ id, type, x, y }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "ITEM",
    item: { id, type, x, y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        // Non facciamo nulla qui per ora, la posizione viene gestita dal dropRef in MapDesigner
      }
    },
  });

  return (
    <div
      ref={dragRef}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: isDragging ? "move" : "pointer",
        backgroundColor: "lightblue",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: isDragging ? "0 0 10px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {type}
    </div>
  );
};

export default DraggableItem;
