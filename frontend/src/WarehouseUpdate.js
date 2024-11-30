import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// Query per ottenere le bottiglie disponibili
const GET_BOTTLES = gql`
  query GetBottles {
    bottles {
      id
      name
      quantityInStock  
    }
  }
`;

// Mutation per aggiornare il magazzino con le nuove quantità
const UPDATE_WAREHOUSE = gql`
  mutation UpdateWarehouse($bottles: [BottleInput]!) {
    updateWarehouse(bottles: $bottles) {
      updatedBottles {
        id
        name
        quantityInStock
      }
    }
  }
`;

const WarehouseUpdate = () => {
  const { loading, error, data } = useQuery(GET_BOTTLES);
  const [updateWarehouse] = useMutation(UPDATE_WAREHOUSE);
  
  const [rows, setRows] = useState([]);

  // Gestione dell'inserimento dei dati per una riga
  const handleAddRow = (bottleId, name) => {
    setRows([
      ...rows,
      {
        bottleId,
        name,
        quantity: 0,
        price: 0,
        totalPrice: 0,
      },
    ]);
  };

  // Gestione del cambiamento dei valori nelle righe
  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    
    // Se la quantità o il prezzo cambia, ricalcoliamo il prezzo totale
    if (field === 'quantity' || field === 'price') {
      newRows[index].totalPrice = newRows[index].quantity * newRows[index].price;
    }
    
    setRows(newRows);
  };

  // Invio dei dati per aggiornare il magazzino
  const handleSubmit = () => {
    const bottlesToUpdate = rows.map(row => ({
      id: Number(row.bottleId),  // Cambiato da 'bottleId' a 'id' per la corrispondenza con lo schema GraphQL
      quantityInStock: row.quantity,
      // Se necessario, puoi includere totalPrice per altre logiche
    }));
  
    updateWarehouse({ variables: { bottles: bottlesToUpdate } })
      .then(response => {
        console.log('Magazzino aggiornato:', response);
        // Puoi resettare il modulo o fare qualcos'altro qui
        setRows([]); // Reset delle righe dopo invio
      })
      .catch(error => {
        console.error('Errore durante l\'aggiornamento del magazzino:', error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Aggiornamento Magazzino</h1>

      <h2>Seleziona Bottiglie</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantità Disponibile</th>
            <th>Prezzo Singolo</th>
            <th>Prezzo Totale</th>
            <th>Aggiungi</th>
          </tr>
        </thead>
        <tbody>
          {data.bottles.map(bottle => (
            <tr key={bottle.id}>
              <td>{bottle.name}</td>
              <td>{bottle.quantityInStock}</td>
              <td>-</td>
              <td>-</td>
              <td>
                <button onClick={() => handleAddRow(bottle.id, bottle.name)}>Aggiungi</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Dettagli Scarico</h2>
      <table>
        <thead>
          <tr>
            <th>Nome Bottiglia</th>
            <th>Quantità</th>
            <th>Prezzo Singolo</th>
            <th>Prezzo Totale</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleChange(index, 'quantity', Number(e.target.value))}
                  min="0"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleChange(index, 'price', Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </td>
              <td>{row.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Aggiorna Magazzino</button>
    </div>
  );
};

export default WarehouseUpdate;
