import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface PieChartCoProps {
  data: PieChartData[];
  colors?: string[];
  width?: number | string;
  height?: number;
  title?: string;
  showTooltip?: boolean;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  dataKey?: string;
  nameKey?: string;
  labelLine?: boolean;
  label?: boolean | ((entry: string) => string);
  className?: string;
}

const DEFAULT_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f',
  '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8dd1e1',
  '#d084d0', '#87d068'
];

const PieChartCo: React.FC<PieChartCoProps> = ({
  data,
  colors = DEFAULT_COLORS,
  width = '100%',
  height = 400,
  title,
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 150,
  dataKey = 'value',
  nameKey = 'name',
  labelLine = false,
  label = false,
  className = ""
}) => {
  const renderLabel = (entry: any) => {
    if (typeof label === 'function') {
      return label(entry);
    }
    if (label) {
      const percentage = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
      return `${entry.name}: ${percentage}%`;
    }
    return '';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        {title && <CardTitle>{title}</CardTitle>}

        {/* Scrollable wrapper for small screens */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: 300 }}>
            <ResponsiveContainer width={width} height={height}>
              <PieChart>
                <Pie
                  data={data}
                  cx={showLegend ? '50%' : '50%'}
                  cy="50%"
                  labelLine={labelLine}
                  label={label ? renderLabel : false}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  fill="#8884d8"
                  dataKey={dataKey}
                  nameKey={nameKey}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>

                {showTooltip && (
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [
                      `${value} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
                      'Value'
                    ]}
                  />
                )}

                {showLegend && (
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="left"
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCo;
