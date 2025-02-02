import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import newRequest from '../../utils/newRequest';

const EyeBall = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPatientsdata, settotalPatientsdata] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await newRequest.get("/api/v1/kpi/eyeball-to-triage",);
        if (response.data.success && response.data.data.timeData) {
          const formattedData = response.data.data.timeData.map(
            (item, index) => ({
              patient: index + 1,
              time: item.timeToTriage > 0 ? item.timeToTriage : 0,
            })
          );
          setChartData(formattedData);
          settotalPatientsdata(response?.data?.data?.stats);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="bg-green rounded-lg shadow-lg p-6 w-full max-w-5xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Time from Eyeball to TRIAGE
      </h2>
      <div className="h-[400px]">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="patient"
                label={{
                  value: `Patient (${totalPatientsdata?.totalPatients || "n"})`,
                  position: "bottom",
                  offset: 0,
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "Time (minutes)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
                domain={[0, "auto"]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                }}
                formatter={(value) => [`${value} minutes`, "Time"]}
                labelFormatter={(value) => `Patient ${value}`}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#ef4444"
                dot={false}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EyeBall;
