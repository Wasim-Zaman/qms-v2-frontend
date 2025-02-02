import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import axios from "axios";
import newRequest from "../../utils/newRequest";

const DepartmentData = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newRequest.get("/api/v1/kpi/patient-counts");
         const colorMapping = {
           ACU: "#FF5733",
           "OB-GYNE": "#33FF57",
           PEDIAE: "#3357FF",
           OPTA: "#FF33A1",
           NEURO: "#33FFF6",
           GENERAL: "#FFC733",
           OR: "#C733FF",
           ICU: "#33FF91",
           TRIAGE: "#FF3333",
         };
        const apiData = response.data.data.departmentWise.map((department) => ({
          name: department.departmentName,
          value: department.patientCount,
          color: colorMapping[department.departmentCode] || "#CCCCCC",
        }));
        setDepartmentData(apiData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading data...</p>;
  }

  return (
    <div className="bg-green rounded-lg shadow-lg p-6 w-full max-w-3xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Clinic Assignment
      </h2>
      <div className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={150}
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} patients`} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentData;
