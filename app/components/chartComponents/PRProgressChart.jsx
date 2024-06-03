// PRProgressChart.js
import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const data = [
  { name: 'Week 1', pr: 5, completed: true },
  { name: 'Week 2', pr: 3, completed: true },
  { name: 'Week 3', pr: 4, completed: true },
  { name: 'Week 4', pr: 2, completed: false },
  { name: 'Week 5', pr: 1, completed: false },
  { name: 'Week 6', pr: 0, completed: false },
];

const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  const radius = 10; // Adjust the radius value as needed
  return (
    <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} />
  );
};

const PRProgressChart = () => {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          PR in progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" color="text.primary">
            8
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, color: 'green' }}>
            <Typography variant="body2">3</Typography>
            <Box component="span" sx={{ ml: 0.5 }}>↑</Box>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          CURRENT MONTH
        </Typography>
        <ResponsiveContainer width="50%" height={100}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <Tooltip />
            <Bar dataKey="pr" shape={<RoundedBar />} fillOpacity={1}>
              {data.map((entry, index) => (
                <Cell
                
                  key={`cell-${index}`}
                  fill={entry.completed ? '#8884d8' : '#9172C0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PRProgressChart;
