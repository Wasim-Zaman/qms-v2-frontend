import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import newRequest from "../../utils/newRequest";
import Spinner from "../../components/spinner/spinner";

const Patientsnumberchat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);

  const fetchPatients = async () => {
    try {
      const response = await newRequest.get(`/api/v1/kpi/registration-trend`);
      setData(response.data.data.trend);
      setTotalPatients(response.data.data.totalPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const months = data.map((item) => item.date);
  const patientCounts = data.map((item) => item.count);

  const chartSetting = {
    yAxis: [{ label: "No. of Patients" }],
  };

  return (
    <div style={{ width: "100%", marginLeft: "20px" }}>
      {/* <h2 className="text-lg font-sans mt-5 ms-5 font-bold">Total Patients: {totalPatients}</h2> */}
      <BarChart
        height={350}
        xAxis={[{ scaleType: "band", data: months, label: "Date" }]}
        series={[
          {
            data: patientCounts,
            label: "Number of Patients for the last 7 days",
            barWidth: 20,
            color: "#1f1fff",
          },
        ]}
        barLabel="value"
        {...chartSetting}
      />
    </div>
  );
};

export default Patientsnumberchat;
