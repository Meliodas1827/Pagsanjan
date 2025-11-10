import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface BarChartCoProps {
    data: Record<string, number | string>[];
    xKey: string;
    barKey: string;
    barColor?: string;
    height?: number;
    title?: string;
    className?: string;
}

const BarChartCo: React.FC<BarChartCoProps> = ({
    data,
    xKey,
    barKey,
    barColor = '#8884d8',
    height = 300,
    title,
    className = '',
}) => {
    return (
        <Card className={`w-full ${className}`}>
            <CardContent className="p-4">
                {title && (
                    <CardTitle>
                        {title}
                    </CardTitle>
                )}
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={xKey}
                            tick={{ fontSize: 12, fill: '#555' }} // font size and color
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#555' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={barKey} fill={barColor} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default BarChartCo;