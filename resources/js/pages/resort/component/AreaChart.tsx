import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardContent } from '@/components/ui/card';

const data = [
  { month: 'Jan', '2023': 4000, '2024': 2400, '2025': 2400 },
  { month: 'Feb', '2023': 3000, '2024': 1398, '2025': 2210 },
  { month: 'Mar', '2023': 2000, '2024': 9800, '2025': 2290 },
  { month: 'Apr', '2023': 2780, '2024': 3908, '2025': 2000 },
  { month: 'May', '2023': 1890, '2024': 4800, '2025': 2181 },
  { month: 'Jun', '2023': 2390, '2024': 3800, '2025': 2500 },
  { month: 'Jul', '2023': 3490, '2024': 4300, '2025': 2100 },
  { month: 'Aug', '2023': 3490, '2024': 4300, '2025': 2100 },
  { month: 'Sep', '2023': 3490, '2024': 4300, '2025': 2100 },
  { month: 'Oct', '2023': 3490, '2024': 4300, '2025': 2100 },
  { month: 'Nov', '2023': 3490, '2024': 4300, '2025': 2100 },
  { month: 'Dec', '2023': 3490, '2024': 4300, '2025': 2100 },
];

const AreaChartComponent = ({title} : {title?: string}) => {
  return (
    <Card className="w-full p-8 mt-6">
      <CardTitle className="mb-4">
        {title || 'Yearly Data Comparison (2023-2025)'}
      </CardTitle>
      <CardContent className="p-0">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="2023"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="2024"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="2025"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartComponent;