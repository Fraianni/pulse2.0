import React, { useState } from "react";

const EditPopup = ({ object, onSave, onClose }) => {
  const [label, setLabel] = useState(object.label || "");
  const [color, setColor] = useState(object.color || "#808080");
  const [budget, setBudget] = useState(object.budget || 0);
  const [customerQuantity, setCustomerQuantity] = useState(object.customerQuantity || 0);

  const isTable = object.type === "TABLE";
console.log(object);
  const handleSave = () => {
    onSave({
      id: object.id,
      label,
      color,
      ...(isTable && { budget, customerQuantity }),
    });
    onClose();
  };

  return (
    <div className="popup">
      <h3>Edit {isTable ? "Table" : "Structure"}</h3>
      <label>
        Label:
        <input value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>
      <label>
        Color:
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      {isTable && (
        <>
          <label>
            Budget:
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </label>
          <label>
            Customer Quantity:
            <input
              type="number"
              value={customerQuantity}
              onChange={(e) => setCustomerQuantity(Number(e.target.value))}
            />
          </label>
        </>
      )}
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditPopup;
