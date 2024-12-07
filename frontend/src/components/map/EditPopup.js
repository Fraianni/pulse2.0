import React, { useState } from "react";
import { FaRedo, FaUndo } from 'react-icons/fa';
import { Button } from '@mui/material';

const EditPopup = ({ object, onSave, onClose, RotateClockwise, RotateCounterClockwise }) => {
  const [label, setLabel] = useState(object.label || "");
  const [color, setColor] = useState(object.color || "#808080");
  const [budget, setBudget] = useState(object.budget || 0);
  const [customerQuantity, setCustomerQuantity] = useState(object.customerQuantity || 0);

  const isTable = object.type === "TABLE";
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
    <div className="d-flex flex-row align-items-center">
      <h3>Edit {isTable ? "Table" : "Structure"}</h3>
      <label className="mx-2">
        <FaRedo onClick={RotateClockwise} />      
      </label>
      <label className="mx-2">
        <FaUndo onClick={RotateCounterClockwise} />
      </label>
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
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={onClose}>Cancel</Button>
    </div>
  );
};

export default EditPopup;
