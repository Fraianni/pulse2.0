import React from "react";
import { useDrag } from "react-dnd";

// Definiamo un oggetto styles con le classi per tavolo e struttura
const styles = {
  table: {
    width: "100px",
    height: "100px",
    backgroundColor: "lightblue",
    textAlign: "center",
    lineHeight: "100px",
    borderRadius: "5px",
  },
  structure: {
    width: "100px",
    height: "100px",
    backgroundColor: "lightgreen",
    textAlign: "center",
    lineHeight: "100px",
    borderRadius: "5px",
  },
};

const Toolbar = () => {
  const [{ isDragging }, dragTableRef] = useDrag({
    type: "ITEM",
    item: { type: "table" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isDraggingStructure }, dragStructureRef] = useDrag({
    type: "ITEM",
    item: { type: "structure" },
    collect: (monitor) => ({
      isDraggingStructure: monitor.isDragging(),
    }),
  });

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc" }}>
      <div
        ref={dragTableRef}
        style={{
          ...styles.table,
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
        }}
      >
        Tavolo
      </div>
      <div
        ref={dragStructureRef}
        style={{
          ...styles.structure,
          opacity: isDraggingStructure ? 0.5 : 1,
          cursor: "move",
        }}
      >
        Struttura
      </div>
    </div>
  );
};

export default Toolbar;
