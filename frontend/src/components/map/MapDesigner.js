import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableItem from "./DraggableItem";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const CREATE_OBJECT = gql`
  mutation CreateObject($type: String!, $x: Float!, $y: Float!) {
    createObject(type: $type, x: $x, y: $y) {
      id
      type
      x
      y
    }
  }
`;

const MapDesigner = () => {
  const [objects, setObjects] = useState([]);
  const dropRef = useRef(null);

  const [createObject] = useMutation(CREATE_OBJECT); // Usa la mutazione

  const [, drop] = useDrop({
    accept: "ITEM",
    drop: async (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      
      const { id, type, isNew } = item;
      const containerRect = dropRef.current.getBoundingClientRect();
      
      if (isNew) {
        const xnewItem = offset.x - containerRect.left;
        const ynewItem = offset.y - containerRect.top;
        
        // Aggiungi un nuovo oggetto nell'interfaccia utente
        setObjects((prev) => [
          ...prev,
          {
            id: Date.now(),
            type,
            x: xnewItem,
            y: ynewItem,
          },
        ]);

        // Chiamata GraphQL per creare l'oggetto nel database
        try {
          await createObject({
            variables: {
              type,
              x: xnewItem,
              y: ynewItem,
            },
          });
        } catch (error) {
          console.error("Errore durante la creazione dell'oggetto:", error);
        }
      } else {
        // Aggiorna la posizione di un oggetto esistente
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          setObjects((prevObjects) =>
            prevObjects.map((obj) =>
              obj.id === id
                ? {
                    ...obj,
                    x: obj.x + delta.x,
                    y: obj.y + delta.y,
                  }
                : obj
            )
          );
        }
      }
    },
  });

  return (
    <div>
      <Toolbar />
      <div
        ref={(node) => {
          dropRef.current = node;
          drop(node); // Passa il nodo a dropRef per il monitoraggio
        }}
        style={{
          width: "800px",
          height: "500px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          position: "relative",
          margin: "20px auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {objects.map((obj) => (
          <DraggableItem
            key={obj.id}
            id={obj.id}
            type={obj.type}
            x={obj.x}
            y={obj.y}
          />
        ))}
      </div>
    </div>
  );
};

export default MapDesigner;