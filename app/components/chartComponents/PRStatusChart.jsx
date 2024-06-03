// PRStatusChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

// Sample data
const data = [
  { name: 'PR1', status: 'completed' },
  { name: 'PR2', status: 'pending' },
  { name: 'PR3', status: 'completed' },
  { name: 'PR4', status: 'pending' },
  { name: 'PR5', status: 'completed' },
];

const PRStatusChart = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          PR Status
        </Typography>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip />
            {data.map((entry, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey="status"
                stroke={entry.status === 'completed' ? '#8884d8' : '#808080'}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PRStatusChart;
