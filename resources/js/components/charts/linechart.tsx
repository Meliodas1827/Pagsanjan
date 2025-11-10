import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface LineChartCoProps {
  data: Record<string, number | string>[];
  xKey: string; // Key for X-axis labels
  lineKeys: { key: string; color?: string }[]; // Multiple lines
  height?: number;
  title?: string;
  showGrid?: boolean;
}

const LineChartCo: React.FC<LineChartCoProps> = ({
  data,
  xKey,
  lineKeys,
  height = 300,
  title,
  showGrid = true,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {title && (
          <CardTitle className="text-muted-foreground text-sm font-bold mb-8">
            {title}
          </CardTitle>
        )}
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: '#555' }} // font size and color
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#555' }}
            />
            <Tooltip />
            <Legend />
            {lineKeys.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.key}
                stroke={line.color || '#8884d8'}
                dot={false}
                strokeWidth={3} // bold line
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartCo;
