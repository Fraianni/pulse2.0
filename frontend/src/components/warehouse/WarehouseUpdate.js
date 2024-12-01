import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';

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
    
    if (field === 'quantity' || field === 'price') {
      newRows[index].totalPrice = newRows[index].quantity * newRows[index].price;
    }
    
    setRows(newRows);
  };

  // Invio dei dati per aggiornare il magazzino
  const handleSubmit = () => {
    const bottlesToUpdate = rows.map(row => ({
      id: Number(row.bottleId),
      quantityInStock: row.quantity,
    }));
  
    updateWarehouse({ variables: { bottles: bottlesToUpdate } })
      .then(response => {
        console.log('Magazzino aggiornato:', response);
        setRows([]); // Reset righe
      })
      .catch(error => {
        console.error('Errore durante l\'aggiornamento del magazzino:', error);
      });
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Errore: {error.message}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Aggiornamento Magazzino</Typography>

      {/* Tabella Bottiglie Disponibili */}
      <Typography variant="h5" gutterBottom>Seleziona Bottiglie</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Quantità Disponibile</TableCell>
            <TableCell>Aggiungi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.bottles.map(bottle => (
            <TableRow key={bottle.id}>
              <TableCell>{bottle.name}</TableCell>
              <TableCell>{bottle.quantityInStock}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleAddRow(bottle.id, bottle.name)}>
                  Aggiungi
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Tabella Dettagli Scarico */}
      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>Dettagli Scarico</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome Bottiglia</TableCell>
            <TableCell>Quantità</TableCell>
            <TableCell>Prezzo Singolo (€)</TableCell>
            <TableCell>Prezzo Totale (€)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleChange(index, 'quantity', Number(e.target.value))}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={row.price}
                  onChange={(e) => handleChange(index, 'price', Number(e.target.value))}
                  inputProps={{ min: 0, step: 0.01 }}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>{row.totalPrice.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Bottone Aggiorna */}
      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        sx={{ marginTop: 3 }}
      >
        Aggiorna Magazzino
      </Button>
    </Box>
  );
};

export default WarehouseUpdate;
