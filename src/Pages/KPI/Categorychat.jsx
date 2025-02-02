import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from "@mui/material/CircularProgress";

const Categorychat = ({ data }) => {
  const [loading, setLoading] = React.useState(true);

  // Ensure data is defined and an array
  const chartData = Array.isArray(data) ? data : [];

  React.useEffect(() => {
    if (chartData.length) {
      setLoading(false);
    }
  }, [chartData]);

  // Show loader while data is being loaded
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "350px",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const months = chartData.map((item) => item.month);
  const BrandNameData = chartData.map((item) => item.BrandName);

  const chartSetting = {
    yAxis: [{ label: "Category Level" }],
  };

  return (
    <div style={{ width: "100%", marginLeft: "20px" }}>
      <BarChart
        height={350}
        // width={800}
        xAxis={[{ scaleType: "band", data: months, label: "No. of Patients" }]}
        series={[
          {
            data: BrandNameData,
            label: "Category",
            barWidth: 20,
            color: "#1fff1f",
          },
        ]}
        barLabel="value"
        {...chartSetting}
      />
    </div>
  );
};

export default Categorychat;
