import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNotifier } from '../context/NotificationContext';
import { API_URL } from '../apiConfig';

const InwardPage = () => {
  const [lotNo, setLotNo] = useState('');
  const [partyName, setPartyName] = useState('');
  const [initialMeters, setInitialMeters] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotifier();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const lotData = {
      lot_no: lotNo,
      party_name: partyName,
      initial_meters: initialMeters,
    };

    try {
      await axios.post(`${API_URL}/api/lots/`, lotData);
      showNotification('Lot created successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error('There was an error creating the lot!', error);
      showNotification('Error creating lot. Check console for details.', 'error');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inward New Fabric Lot
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="lot_no"
          label="Lot Number"
          name="lot_no"
          autoFocus
          value={lotNo}
          onChange={(e) => setLotNo(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="party_name"
          label="Party Name"
          id="party_name"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="initial_meters"
          label="Initial Meters"
          type="number"
          id="initial_meters"
          value={initialMeters}
          onChange={(e) => setInitialMeters(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Lot
        </Button>
      </Box>
    </Paper>
  );
};

export default InwardPage;