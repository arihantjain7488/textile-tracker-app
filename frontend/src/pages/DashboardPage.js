import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, Grid, CardActionArea } from '@mui/material';
import axios from 'axios';

const DashboardPage = () => {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/lots/');
        setLots(response.data);
      } catch (error) {
        console.error("There was an error fetching the lots!", error);
      }
    };

    fetchLots();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Live Factory Dashboard
      </Typography>
      <Grid container spacing={3}>
        {lots.length > 0 ? (
          lots.map((lot) => (
            <Grid item xs={12} sm={6} md={4} key={lot.id}>
              <Card>
                <CardActionArea component={Link} to={`/lots/${lot.id}`}>
                  <CardContent>
                    <Typography variant="h6">Lot: {lot.lot_no}</Typography>
                    <Typography><strong>Party:</strong> {lot.party_name}</Typography>
                    <Typography><strong>Meters:</strong> {lot.initial_meters}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No lots found. Try creating one!</Typography>
        )}
      </Grid>
    </div>
  );
};

export default DashboardPage;