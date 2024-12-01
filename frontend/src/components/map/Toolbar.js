import React from "react";
import { useDrag } from "react-dnd";

const Toolbar = () => {
  const tools = ["Table", "Structure"];

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
      {tools.map((tool) => (
        <ToolItem key={tool} type={tool} />
      ))}
    </div>
  );
};

const ToolItem = ({ type }) => {
  const [, dragRef] = useDrag({
    type: "ITEM",
    item: { type, isNew: true }, // Specifica che è un nuovo elemento
  });

  return (
    <div
      ref={dragRef}
      style={{
        padding: "10px",
        backgroundColor: "lightgray",
        border: "1px solid black",
        borderRadius: "5px",
        cursor: "grab",
      }}
    >
      {type}
    </div>
  );
};

export default Toolbar;
