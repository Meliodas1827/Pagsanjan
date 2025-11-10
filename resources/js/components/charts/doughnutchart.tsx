import React from 'react';
import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface DoughnutChartCoProps {
    data: Record<string, number>[];
    dataKey: string;
    nameKey: string;
    colors?: string[];
    height?: number;
    outerRadius?: number;
    title?: string;
    className?: string;
}

// Custom label inside slices
const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    if (
        cx === undefined ||
        cy === undefined ||
        innerRadius === undefined ||
        outerRadius === undefined ||
        midAngle === undefined
    ) {
        return null;
    }

    const inner = Number(innerRadius);
    const outer = Number(outerRadius);

    const RADIAN = Math.PI / 180;
    const radius = inner + (outer - inner) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
        >
            {`${((percent ?? 0) * 100).toFixed(0)}%`}
        </text>
    );
};

const DoughnutChartCo: React.FC<DoughnutChartCoProps> = ({
    data,
    dataKey,
    nameKey,
    colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
    height = 300,
    outerRadius,
    title,
    className = '',
}) => {
    return (
        <Card className={`w-full ${className}`}>
            <CardContent className="p-4">
                {title && (
                    <CardTitle >
                        {title}
                    </CardTitle>
                )}
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            cx="50%"
                            cy="50%"
                            innerRadius="50%"
                            outerRadius={outerRadius}
                            fill="#8884d8"
                            paddingAngle={0}
                            label={renderCustomLabel}
                            labelLine={false}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            layout="vertical"
                            align="left"
                            verticalAlign="middle"
                            wrapperStyle={{ paddingLeft: '20%' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DoughnutChartCo;