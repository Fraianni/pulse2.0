import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BottlesList from './BottlesList';
import WarehouseUpdate from './WarehouseUpdate';

const WarehouseDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <h1>Gestione Magazzino</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Lista Bottiglie" />
          <Tab label="Aggiorna Magazzino" />
        </Tabs>
      </Box>
      <Box sx={{ padding: 2 }}>
        {activeTab === 0 && <BottlesList />}
        {activeTab === 1 && <WarehouseUpdate />}
      </Box>
    </div>
  );
};

export default WarehouseDashboard;
