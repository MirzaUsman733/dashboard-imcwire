// PRCompletionChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

// Sample data
const data = [
  { name: 'Step 1', completed: false },
  { name: 'Step 2', completed: false },
  { name: 'Step 3', completed: true },
  { name: 'Step 4', completed: true },
  { name: 'Step 5', completed: true },
];

const PRCompletionChart = () => {
  const processedData = data.map((entry, index) => ({
    name: entry.name,
    value: index + 1,
    stroke: entry.completed ? '#8884d8' : '#808080',
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          PR Completion Status
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={processedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              dot={false}
              strokeDasharray="3 3"
            />
            {processedData.map((entry, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey="value"
                stroke={entry.stroke}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PRCompletionChart;
