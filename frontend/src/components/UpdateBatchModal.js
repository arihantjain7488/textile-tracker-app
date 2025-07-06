import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../apiConfig';

const UpdateBatchModal = ({ open, onClose, onUpdateSuccess, batch }) => {
  const [processes, setProcesses] = useState([]);
  const [machines, setMachines] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch dropdown data when the modal opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      const fetchDropdownData = async () => {
        try {
          const processesRes = await axios.get(`${API_URL}/api/processes/`);
          const machinesRes = await axios.get(`${API_URL}/api/machines/`);
          // Fetch all users and filter for supervisors on the frontend
          const usersRes = await axios.get(`${API_URL}/api/users/`);
          
          setProcesses(processesRes.data);
          setMachines(machinesRes.data);
          setSupervisors(usersRes.data.filter(u => u.role === 'SUPERVISOR'));
          
          // Pre-fill form with current batch data
          if (batch) {
            setFormData({
              status: batch.status || '',
              current_process: batch.current_process || '',
              current_machine: batch.current_machine || '',
              current_operator: batch.current_operator || '', // This field might be for an operator, but we will add supervisor for now
              // If you want a separate supervisor field, you'd add it to your Batch model first
            });
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch dropdown data", error);
          setLoading(false);
        }
      };
      
      fetchDropdownData();
    }
  }, [open, batch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const dataToSubmit = {};
    for (const key in formData) {
        // Ensure we send 'null' if a value is cleared, otherwise Render might ignore the change
        dataToSubmit[key] = formData[key] === '' ? null : formData[key];
    }

    try {
      await axios.patch(`${API_URL}/api/batches/${batch.id}/`, dataToSubmit);
      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to update batch", error);
      alert("Failed to update batch.");
    }
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Update Batch: {batch.batch_no}</DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select name="status" labelId="status-label" value={formData.status || ''} label="Status" onChange={handleChange}>
                <MenuItem value="AWAITING_PROCESS">Awaiting Process</MenuItem>
                <MenuItem value="IN_PROCESS">In Process</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="ON_HOLD">On Hold</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="process-label">Process</InputLabel>
                <Select name="current_process" labelId="process-label" value={formData.current_process || ''} label="Process" onChange={handleChange}>
                    {processes.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="machine-label">Machine</InputLabel>
                <Select name="current_machine" labelId="machine-label" value={formData.current_machine || ''} label="Machine" onChange={handleChange}>
                    {machines.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                </Select>
            </FormControl>
            {/* You could add a dropdown for supervisors here if you add the field to your Batch model */}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBatchModal;