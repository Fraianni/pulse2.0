import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableItem from "./DraggableItem";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import EditPopup from "./EditPopup"; // Importa il tuo popup per la modifica

const GET_EXISTING_OBJECTS = gql`
  query {
    allObjects {
      ... on ObjectTableType {
      type
        id
        x
        y
        label
        color
      }
      ... on ObjectStructureType {
      type
        id
        x
        y
        label
        color
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

const UPDATE_OBJECT = gql`
mutation UpdateMapObject(
  $id: ID!
  $label: String,
  $color: String,
  $budget: Float,
  $customerQuantity: Int,
  $x: Float,
  $y: Float
) {
  updateMapObject(
    id: $id
    label: $label
    color: $color
    budget: $budget
    customerQuantity: $customerQuantity,
    x: $x,
    y: $y
  ) {
    mapObject {
      ... on ObjectTableType {
        id
        label
        color
        budget
        customerQuantity
      }
      ... on ObjectStructureType {
        id
        label
        color
      }
    }
  }
}
`;

const MapDesigner = () => {
  const [objects, setObjects] = useState([]);
  const dropRef = useRef(null);

  const { data: existingObjects, loading, error } = useQuery(GET_EXISTING_OBJECTS); // Usa la query per caricare oggetti esistenti
  const [createObject] = useMutation(CREATE_OBJECT); // Usa la mutazione per creare oggetti nuovi
  const [updateObject] = useMutation(UPDATE_OBJECT); // Usa la mutazione per aggiornare gli oggetti
  const [selectedObject, setSelectedObject] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Stato per la visibilità del popup
  const [selectedObjects, setSelectedObjects] = useState([]);

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
          const updatedObjects = objects.map((obj) =>
            obj.id === id
              ? {
                  ...obj,
                  x: obj.x + delta.x,
                  y: obj.y + delta.y,
                }
              : obj
          );
          setObjects(updatedObjects);
  
          // Aggiorna l'oggetto nel backend
          const updatedObject = updatedObjects.find((obj) => obj.id === id);
          console.log(updatedObject);
          if (updatedObject) {
            try {
                console.log("Updating object with variables:", {
                    id: updatedObject.id,
                    x: updatedObject.x,
                    y: updatedObject.y,
                  });
              const response = await updateObject({
                variables: {
                  id:updatedObject.id,
                  x: updatedObject.x,
                  y: updatedObject.y,
                },
              });
              console.log("Oggetto aggiornato:", response.data);
            } catch (error) {
              console.error("Errore durante l'aggiornamento dell'oggetto:", error);
            }
          }
        }
      }
    },
  });

  const handleSave = async (updatedData) => {
    console.log(updatedData);
    try {
      const response = await updateObject({
        variables: updatedData,
      });
      console.log("Oggetto aggiornato:", response.data);
      setObjects((prev) =>
        prev.map((obj) => (obj.id === updatedData.id ? { ...obj, ...updatedData } : obj))
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'oggetto:", error);
    }
  };
  const handleSelectObject = (obj) => {
    console.log(obj); // Per verificare che l'oggetto sia selezionato correttamente
    
    setSelectedObjects((prevSelected) => {
      const isSelected = prevSelected.some((selectedObj) => selectedObj.id === obj.id);
      if (isSelected) {
        // Se l'oggetto è già selezionato, lo rimuoviamo dalla lista
        return prevSelected.filter((selectedObj) => selectedObj.id !== obj.id);
      } else {
        // Altrimenti, lo aggiungiamo alla lista
        return [...prevSelected, obj];
      }
    });
  };
  
  useEffect(() => {
    console.log(selectedObjects);
    // Verifica se ci sono più di un oggetto selezionato
    if (selectedObjects.length === 1) {
      setSelectedObject(selectedObjects[0]);
    } else {
      setSelectedObject(null); // Se ci sono più oggetti selezionati, non apriamo il popup
    }
  }, [selectedObjects]); // Questo effetto si attiva ogni volta che selectedObjects cambia
  const handleColorChange = (color) => {
    // Cambia il colore di tutti gli oggetti selezionati
    selectedObjects.forEach(async (obj) => {
      try {
        await updateObject({
          variables: { id: obj.id, color },
        });
        setObjects((prevObjects) =>
          prevObjects.map((o) =>
            o.id === obj.id ? { ...o, color } : o
          )
        );
      } catch (error) {
        console.error("Errore durante l'aggiornamento del colore:", error);
      }
    });
    setSelectedObjects([]); // Reset selezione dopo il salvataggio
  };
  
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
            color={obj.color}  // Passa il colore dal backend

            onClick={() => handleSelectObject(obj)} // Modifica la funzione di click

          />
        ))}
      </div>
      {selectedObjects.length > 1 && (
      <div>
        <label>Scegli un colore:</label>
        <input
          type="color"
          onChange={(e) => handleColorChange(e.target.value)}
        />
      </div>
    )}

    {/* Popup per un singolo oggetto */}
    {selectedObjects.length === 1 && selectedObject && (
      <EditPopup
        object={selectedObject}
        onSave={handleSave}
        onClose={() => setSelectedObject(null)}
      />
    )}
    </div>
  );
};

export default MapDesigner;
