import { DashboardCard } from '@/components/ui';
import { formatTime, getAQHILevel } from '@/lib/utils';
import { HistoricalAQHI } from '@/types';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AQHIChartProps {
  data: HistoricalAQHI[];
  loading?: boolean;
  error?: string;
}

export function AQHIChart({ data, loading, error }: AQHIChartProps) {
  const chartData = data.map(item => ({
    time: formatTime(item.timestamp),
    aqhi: item.aqhi,
    level: getAQHILevel(item.aqhi),
    fullTime: new Date(item.timestamp).toLocaleString()
  }));

  const getLineColor = (aqhi: number) => {
    if (aqhi <= 3) return '#22c55e';
    if (aqhi <= 6) return '#eab308';
    if (aqhi <= 7) return '#f97316';
    if (aqhi <= 10) return '#ef4444';
    return '#7c2d12';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{data.fullTime}</p>
          <p className="text-sm">
            AQHI: <span className="font-bold">{data.aqhi}</span>
          </p>
          <p className="text-sm">
            Level: <span className="font-medium">{data.level}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardCard
      title="24-Hour AQHI Trend"
      icon={<TrendingUp className="h-5 w-5" />}
      loading={loading}
      error={error}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[0, 11]}
              className="text-xs"
              label={{ value: 'AQHI', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="aqhi"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* AQHI Level Reference */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
          AQHI Levels:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">1-3 Low</span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">4-6 Moderate</span>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">7 High</span>
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">8-10 Very High</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">11+ Serious</span>
        </div>
      </div>
    </DashboardCard>
  );
}
