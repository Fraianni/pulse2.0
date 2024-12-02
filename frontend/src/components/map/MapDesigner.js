import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableItem from "./DraggableItem";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_EXISTING_OBJECTS = gql`
  query {
    allObjects {
      ... on ObjectTableType {
        id
        x
        y
        label
      }
      ... on ObjectStructureType {
        id
        x
        y
        label
      }
    }
  }
`;

const CREATE_OBJECT = gql`
mutation CreateMapObject($type: String!, $x: Float!, $y: Float!) {
  createMapObject(type: $type, x: $x, y: $y) {
    mapObject {
      ... on ObjectTableType {
        id
        x
        y
      }
      ... on ObjectStructureType {
        id
        x
        y
      }
    }
  }
}
`;

const MapDesigner = () => {
  const [objects, setObjects] = useState([]);
  const dropRef = useRef(null);

  const { data: existingObjects, loading, error } = useQuery(GET_EXISTING_OBJECTS); // Usa la query per caricare oggetti esistenti
console.log("ex",existingObjects);
  const [createObject] = useMutation(CREATE_OBJECT); // Usa la mutazione per creare oggetti nuovi

  useEffect(() => {
    // Se ci sono oggetti esistenti, impostali nello stato
    if (existingObjects && existingObjects.allObjects) {
        console.log("miao",)
      setObjects(existingObjects.allObjects);
    }
  }, [existingObjects]);

  const [, drop] = useDrop({
    accept: "ITEM",
    drop: async (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const { id, type, isNew } = item;
      const containerRect = dropRef.current.getBoundingClientRect();

      if (isNew) {
        const x = offset.x - containerRect.left;
        const y = offset.y - containerRect.top;

        // Aggiungi un nuovo oggetto nell'interfaccia utente
        setObjects((prev) => [
          ...prev,
          {
            id: Date.now(), // Genera un id temporaneo
            type,
            x,
            y,
          },
        ]);

        try {
          const response = await createObject({
            variables: {
              type,
              x,
              y,
            },
          });
          console.log("Oggetto creato:", response.data);
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

  if (error) return <p>Error loading objects: {error.message}</p>;

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
