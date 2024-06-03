"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Container, Grid, Typography } from '@mui/material';
import PRStatusChart from '../components/chartComponents/PRStatusChart';
import PRCompletionChart from '../components/chartComponents/PRCompletionChart';
import PRProgressChart from '../components/chartComponents/PRProgressChart';

const data = [
  { name: 'Jan', pendingPRs: 5 },
  { name: 'Feb', pendingPRs: 3 },
  { name: 'Mar', pendingPRs: 4 },
  { name: 'Apr', pendingPRs: 2 },
  { name: 'May', pendingPRs: 1 },
  { name: 'Jun', pendingPRs: 0 },
  // Add more data points as needed
];

const Page = () => {
  return (
    <Container>
    <Grid container spacing={2}>
    <Grid item xs={12} md={9}>
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Pending PRs Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pendingPRs" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </Grid>
    <Grid item xs={12} md={3}>
          {/* <PRStatusChart /> */}
          {/* <PRCompletionChart /> */}
          <PRProgressChart/>
        </Grid>
      </Grid>
      </Container>
  );
};

export default Page;
