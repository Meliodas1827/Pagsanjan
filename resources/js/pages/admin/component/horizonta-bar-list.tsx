import { Card, CardContent } from '../../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: "Along Thing's", value: 60, color: "#66bb6a" },
  { name: "Halohale", value: 200, color: "#90caf9" },
  { name: "Aria", value: 400, color: "#aed6f1" },
  { name: "Balance Blossom", value: 30, color: "#bcaaa4" },
  { name: "Casa Blanca", value: 150, color: "#d4e157" },
  { name: "Casa del Rio", value: 160, color: "#ab47bc" },
  { name: "Ruko", value: 120, color: "#ef6c00" },
  { name: "Lido Tulip", value: 80, color: "#004d40" },
  { name: "Mason Bellevue", value: 40, color: "#80cbc4" },
  { name: "Penguin Falls Lodge", value: 90, color: "#e53935" },
  { name: "Total cycling", value: 130, color: "#0d47a1" },
  { name: "Tropical Brevari", value: 180, color: "#004d40" }
];

export default function HorizontalBarList() {
  return (
    <Card className='mt-3 py-6'>
      <CardContent>

    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 0, right: 30, bottom: 0, left: 20 }}
      >
        <XAxis type="number" hide tick={{ fontSize: 12, fill: '#555' }} />
        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#555' }}/>
        <Tooltip />
        <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
