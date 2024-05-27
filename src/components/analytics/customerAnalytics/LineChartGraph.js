import { Card, CardHeader } from "@mui/material";
import React from "react";
import Chart from "react-google-charts";

const LineChartGraph = ({
  graphData,
  subTitle,
  vAxis,
  hAxis = "Months",
  title,
  color = "#3366CC",
}) => {
  // console.log(graphData);
  const options = {
    // title: "",
    legend: { position: "top", maxLines: 3 },
    chart: {
      // title: "Monthly Users",
      subtitle: subTitle,
    },
    vAxis: {
      title: vAxis, // Set the title of the Y-axis
    },
    hAxis: {
      title: hAxis, // Set the title of the Y-axis
    },
    colors: [color],
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader title={<small style={{ fontSize: "18px" }}>{title}</small>} />
      <Chart
        chartType="LineChart"
        data={graphData}
        // data={graphData}
        options={options}
      />
    </Card>
  );
};

export default LineChartGraph;
