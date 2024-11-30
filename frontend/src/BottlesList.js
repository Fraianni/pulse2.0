import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './BottlesList.css';

const GET_BOTTLES = gql`
  query GetBottles {
    bottles {
      id
      name
      typeBottle
      quantityInStock
    }
  }
`;

const CREATE_BOTTLE = gql`
  mutation CreateBottle($name: String!, $typeBottle: String!, $quantityInStock: Int!, $warehouse_id: Int!) {
    createBottle(name: $name, typeBottle: $typeBottle, quantityInStock: $quantityInStock, warehouseId: $warehouse_id) {
      bottle {
        id
        name
        typeBottle
        quantityInStock
      }
    }
  }
`;

const BottlesList = () => {
  const [name, setName] = useState('');
  const [typeBottle, setTypeBottle] = useState('');
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [warehouseId, setWarehouseId] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { loading, error, data } = useQuery(GET_BOTTLES);
  const [createBottle] = useMutation(CREATE_BOTTLE, {
    refetchQueries: [{ query: GET_BOTTLES }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createBottle({
      variables: { name, typeBottle, quantityInStock, warehouse_id: warehouseId },
    })
      .then(() => {
        setName('');
        setTypeBottle('');
        setQuantityInStock(0);
        setWarehouseId(1);
      })
      .catch((err) => console.error('Error during mutation:', err));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBottles = () => {
    if (!data || !data.bottles) return [];
    const bottles = [...data.bottles];
    if (sortConfig.key) {
        bottles.sort((a, b) => {
            const valueA = typeof a[sortConfig.key] === 'string' ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
            const valueB = typeof b[sortConfig.key] === 'string' ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];
            
            if (valueA < valueB) {
              return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
              return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
          });
    }
    return bottles;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bottles-container">
      <h1 className="title">Bottles Inventory</h1>
      <table className="bottles-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('typeBottle')}>Type {sortConfig.key === 'typeBottle' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('quantityInStock')}>Quantity {sortConfig.key === 'quantityInStock' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
          </tr>
        </thead>
        <tbody>
          {sortedBottles().map((bottle) => (
            <tr key={bottle.id}>
              <td>{bottle.id}</td>
              <td>{bottle.name}</td>
              <td>{bottle.typeBottle}</td>
              <td>{bottle.quantityInStock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="form-title">Add a New Bottle</h2>
      <form className="bottle-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="typeBottle">Type</label>
          <input
            type="text"
            id="typeBottle"
            value={typeBottle}
            onChange={(e) => setTypeBottle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantityInStock">Quantity</label>
          <input
            type="number"
            id="quantityInStock"
            value={quantityInStock}
            onChange={(e) => setQuantityInStock(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="warehouseId">Warehouse ID</label>
          <input
            type="number"
            id="warehouseId"
            value={warehouseId}
            onChange={(e) => setWarehouseId(Number(e.target.value))}
          />
        </div>
        <button type="submit" className="submit-button">Add Bottle</button>
      </form>
    </div>
  );
};

export default BottlesList;
