import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ChartPanel({ history }) {
  const chartData = history.map((item, idx) => ({
    name: `Run ${history.length - idx}`,
    Confidence: item.confidencePercent,
    "Fault Code": item.fault_code,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h2>Confidence Trend & Fault Code</h2>
        <p className="card-subtitle">
          Visualizes confidence % and predicted fault code across your last few
          predictions.
        </p>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis yAxisId="left" orientation="left" stroke="#35d29a" />
            <YAxis yAxisId="right" orientation="right" stroke="#5d8cff" domain={[0, 3]} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Confidence"
              stroke="#35d29a"
              activeDot={{ r: 6 }}
              strokeWidth={2.5}
            />
            <Line
              yAxisId="right"
              type="stepAfter"
              dataKey="Fault Code"
              stroke="#5d8cff"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="placeholder-text">Chart will show once you run predictions.</p>
      )}
    </div>
  );
}

export default ChartPanel;
