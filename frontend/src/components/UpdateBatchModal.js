import React, { useState, useEffect } from 'react'; // This line is now fixed
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const UpdateBatchModal = ({ open, onClose, onUpdateSuccess, batch }) => {
  const [processes, setProcesses] = useState([]);
  const [machines, setMachines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [formData, setFormData] = useState({});

  // Fetch dropdown data when the modal opens
  useEffect(() => {
    if (open) {
      axios.get('http://127.0.0.1:8000/api/processes/').then(res => setProcesses(res.data));
      axios.get('http://127.0.0.1:8000/api/machines/').then(res => setMachines(res.data));
      axios.get('http://127.0.0.1:8000/api/users/').then(res => setOperators(res.data.filter(u => u.role === 'OPERATOR')));

      if (batch) {
        setFormData({
          status: batch.status || '',
          current_process: batch.current_process || '',
          current_machine: batch.current_machine || '',
          current_operator: batch.current_operator || ''
        });
      }
    }
  }, [open, batch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Filter out empty string values before sending
    const dataToSubmit = {};
    for (const key in formData) {
        if (formData[key] !== '') {
            dataToSubmit[key] = formData[key];
        }
    }

    try {
      await axios.patch(`http://127.0.0.1:8000/api/batches/${batch.id}/`, dataToSubmit);
      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to update batch", error);
      alert("Failed to update batch.");
    }
  };

  if (!batch) return null; // Don't render if there's no batch

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Update Batch: {batch.batch_no}</DialogTitle>
      <DialogContent>
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
        <FormControl fullWidth margin="normal">
            <InputLabel id="operator-label">Operator</InputLabel>
            <Select name="current_operator" labelId="operator-label" value={formData.current_operator || ''} label="Operator" onChange={handleChange}>
                {operators.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
            </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBatchModal;