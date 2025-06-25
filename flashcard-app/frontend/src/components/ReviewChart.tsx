import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

type Props = {
  data: { date: string; Easy: number; Hard: number; Wrong: number }[];
};

const ReviewChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Easy" stroke="#4caf50" strokeWidth={2} />
        <Line type="monotone" dataKey="Hard" stroke="#ff9800" strokeWidth={2} />
        <Line type="monotone" dataKey="Wrong" stroke="#f44336" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReviewChart;
