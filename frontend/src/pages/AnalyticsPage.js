import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../apiConfig';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/analytics/`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error("Failed to fetch analytics", err));
  }, []);

  if (!analytics) {
    return <Typography>Loading analytics...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>Batches by Status</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.status_counts.map(item => (
                  <TableRow key={item.status}>
                    <TableCell>{item.status}</TableCell>
                    <TableCell align="right">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>Operator Performance (Completed Batches)</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Operator</TableCell>
                  <TableCell align="right">Total Meters Processed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.operator_performance.map(item => (
                  <TableRow key={item.current_operator__name}>
                    <TableCell>{item.current_operator__name}</TableCell>
                    <TableCell align="right">{item.total_meters}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AnalyticsPage;