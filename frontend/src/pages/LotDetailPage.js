import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography, Paper, Box, List, ListItem, ListItemText,
  Divider, TextField, Button, Grid
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import UpdateBatchModal from '../components/UpdateBatchModal';
import { useNotifier } from '../context/NotificationContext';

const LotDetailPage = () => {
  const [lot, setLot] = useState(null);
  const { lotId } = useParams();
  const { showNotification } = useNotifier();

  const [batchNo, setBatchNo] = useState('');
  const [batchMeters, setBatchMeters] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const fetchLotDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/lots/${lotId}/`);
      setLot(response.data);
    } catch (error) {
      console.error("Error fetching lot details!", error);
      showNotification('Could not load lot details.', 'error');
    }
  }, [lotId, showNotification]);

  useEffect(() => {
    fetchLotDetails();
  }, [fetchLotDetails]);

  const handleBatchSubmit = async (event) => {
    event.preventDefault();
    const batchData = { lot: lotId, batch_no: batchNo, meters: batchMeters };
    try {
      await axios.post(`${API_URL}/api/batches/`, batchData);
      showNotification('Batch created successfully!');
      setBatchNo('');
      setBatchMeters('');
      fetchLotDetails();
    } catch (error) {
      console.error('Error creating batch!', error);
      showNotification('Error creating batch.', 'error');
    }
  };

  const handleOpenModal = (batch) => {
    setEditingBatch(batch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseModal();
    fetchLotDetails();
    showNotification("Batch updated successfully!");
  };

  if (!lot) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Lot: {lot.lot_no}</Typography>
            <Typography variant="h6">Party: {lot.party_name}</Typography>
            <Typography>Initial Meters: {lot.initial_meters}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Create New Batch</Typography>
            <Box component="form" onSubmit={handleBatchSubmit}>
              <TextField label="Batch Number" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} fullWidth required margin="normal" />
              <TextField label="Meters for Batch" type="number" value={batchMeters} onChange={(e) => setBatchMeters(e.target.value)} fullWidth required margin="normal" />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Batch</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Existing Batches</Typography>
            <List>
              {lot.batches && lot.batches.length > 0 ? (
                lot.batches.map((batch, index) => (
                  <React.Fragment key={batch.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="update" onClick={() => handleOpenModal(batch)}>
                          <EditIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`Batch No: ${batch.batch_no}`}
                        secondary={`Meters: ${batch.meters} | Status: ${batch.status}`}
                      />
                    </ListItem>
                    {index < lot.batches.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography>No batches created for this lot yet.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {editingBatch && (
        <UpdateBatchModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onUpdateSuccess={handleUpdateSuccess}
          batch={editingBatch}
        />
      )}
    </>
  );
};

export default LotDetailPage;