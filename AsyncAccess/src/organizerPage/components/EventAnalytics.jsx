import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getEventAnalyticsData } from '../../services/eventService';

const Title = (props) => (
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
    {props.children}
  </Typography>
);

export default function EventAnalytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getEventAnalyticsData();
        setAnalyticsData(data || []);
      } catch (err) {
        console.error("Failed to fetch event analytics:", err);
        setError(err.data?.error || err.message || 'Failed to load event analytics.');
        setAnalyticsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ mt: 2, p: 2, width: '100%' }}>
        <CardContent>
          <Title>Event Performance Analytics</Title>
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (analyticsData.length === 0) {
    return (
      <Card sx={{ mt: 2, p: 2, width: '100%' }}>
        <CardContent>
          <Title>Event Performance Analytics</Title>
          <Typography sx={{ textAlign: 'center', mt: 3 }}>
            No event data available to display analytics. Create some events first!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const chartData = analyticsData.map(event => ({
    title: event.title,
    bookedTickets: event.bookedTickets || 0,
    unbookedTickets: (event.totalTickets || 0) - (event.bookedTickets || 0),
  }));

  const eventTitles = chartData.map(d => d.title);
  const bookedTicketsData = chartData.map(d => d.bookedTickets);
  const unbookedTicketsData = chartData.map(d => d.unbookedTickets);

  return (
    <Card sx={{ mt: 2, p: { xs: 2, sm: 3 }, width: '100%' }}>
      <CardContent>
        <Title>Event Performance Analytics</Title>
        <Box sx={{ width: '100%', mt: 3 }}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: eventTitles }]}
            series={[
              { data: bookedTicketsData, label: 'Booked Tickets', color: '#4caf50' }, // Green
              { data: unbookedTicketsData, label: 'Unbooked Tickets', color: '#ff9800' }, // Orange
            ]}
            height={400}
            margin={{ top: 20, bottom: 70, left: 50, right: 20 }} // Adjust margins for labels
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
              },
            }}
            sx={{
              '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': { // Target x-axis labels
                transform: 'rotate(-30deg)',
                textAnchor: 'end',
                transformOrigin: 'center',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
