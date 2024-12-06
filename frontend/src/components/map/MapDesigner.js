import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableItem from "./DraggableItem";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import EditPopup from "./EditPopup"; // Importa il tuo popup per la modifica
import { GET_MAP_DIMENSIONS, UPDATE_MAP_DIMENSIONS } from "../../graphql/graphqlQueries" // Percorso relativo

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
  const [lastClick, setLastClick] = useState(null); // Per memorizzare l'orario dell'ultimo clic
  const [clickTimeout, setClickTimeout] = useState(null); // Per gestire il timeout tra i clic
  const [updateMapDimensions] = useMutation(UPDATE_MAP_DIMENSIONS);
  const [mapDimensions, setMapDimensions] = useState({ width: 800, height: 500 });
  const [isEditingDimensions, setIsEditingDimensions] = useState(false);

  const { data: dimensionData, loading: dimensionsLoading } = useQuery(GET_MAP_DIMENSIONS, {
    variables: { mapId: 1 },  // Passa 'id' qui invece di 'clubAreaId'
    onCompleted: (data) => {
      console.log('Query completed with data:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    },
  });
  useEffect(() => {
    console.log("sono nel ujseffect");
    if (dimensionData && dimensionData.map) {  // Usa `dimensionData.map` anziché `dimensionData.mapDimensions`
      setMapDimensions(dimensionData.map);  // Assegna direttamente `dimensionData.map` a `setMapDimensions`

    }
  }, [dimensionData]);
  
  // Salvare le nuove dimensioni nel backend
  const handleDimensionSave = async () => {
    try {
      await updateMapDimensions({
        variables: {
          mapId: 1,  // Passa 'id' qui invece di 'clubAreaId'
          width: mapDimensions.width,
          height: mapDimensions.height,
        },
      });
      setIsEditingDimensions(false); // Chiudi il modulo di modifica
    } catch (error) {
      console.error("Errore durante l'aggiornamento delle dimensioni:", error);
    }
  };

  // UI per modificare le dimensioni della mappa
  const renderDimensionEditor = () => (
    <div style={{ marginBottom: "10px" }}>
      <label>
        Larghezza:
        <input
          type="number"
          value={mapDimensions.width}
          onChange={(e) => setMapDimensions((prev) => ({ ...prev, width: +e.target.value }))}
        />
      </label>
      <label style={{ marginLeft: "10px" }}>
        Altezza:
        <input
          type="number"
          value={mapDimensions.height}
          onChange={(e) => setMapDimensions((prev) => ({ ...prev, height: +e.target.value }))}
        />
      </label>
      <button onClick={handleDimensionSave}>Salva</button>
    </div>
  );
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
            rotation: 0, // Aggiungiamo la rotazione iniziale
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
        // Altrimenti, lo aggiungiamo alla lista e aggiungiamo la classe "vibration"
        return [...prevSelected, { ...obj, vibration: true }];
      }
    });
  };

  const handleRotateObject = (id) => {
    setObjects(prevObjects => 
      prevObjects.map(obj => 
        obj.id === id ? {
          ...obj,
          rotation: obj.rotation + 90 // Ruota di 90 gradi ad ogni click
        } : obj
      )
    );
  };


  //
  //  IMPLEMENTAZIONE DELLA ROTAZIONE DELL'OGGETTO -> Sul doppio click dell'oggetto avvenuto entro x secondi, l'oggetto verrà ruotato in verticale.
  //

  const handleDoubleClick = (id) => {
    const currentTime = Date.now();
    console.log("ID SELEZXIONATO", id);
    // Se è passato troppo tempo tra i clic (più di 300 ms), resettare il conteggio
    if (lastClick && currentTime - lastClick > 5000) {
      setLastClick(currentTime); // Ritorniamo a iniziare il conteggio dei clic
      return;
    }

    if (lastClick && currentTime - lastClick <= 5000) {
      // Ruota l'oggetto selezionato di 90 gradi
      
      setObjects(prevObjects => 
        prevObjects.map(obj => {
          console.log('Obj rotation before update:', obj.rotation); // Stampa la rotazione prima dell'aggiornamento
          return obj.id === id ? { 
            ...obj, 
            rotation: (90) % 360 // Ruota di 90 gradi
          } : obj;
        })
      );
      setLastClick(null); // Resetta il contatore dopo il doppio clic
    }
    setLastClick(currentTime); // Aggiorna il momento dell'ultimo clic
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
      {isEditingDimensions ? (
        renderDimensionEditor()
      ) : (
        <button onClick={() => setIsEditingDimensions(true)}>Modifica Dimensioni</button>
      )}
      <div
        ref={(node) => {
          dropRef.current = node;
          drop(node); // Passa il nodo a dropRef per il monitoraggio
        }}
        style={{
          width: `${mapDimensions.width}px`,
          height: `${mapDimensions.height}px`,
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
            type={obj.label || obj.type}
            x={obj.x}
            y={obj.y}
            color={obj.color}
            className={
              selectedObjects.some((selectedObj) => selectedObj.id === obj.id) ? "vibration" : ""
            }
            onClick={() => handleSelectObject(obj)}
            rotation={obj.rotation}
            onDoubleClick={() => handleDoubleClick(obj.id)}
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
