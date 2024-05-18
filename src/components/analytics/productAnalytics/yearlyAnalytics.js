import { Card, CardHeader } from "@mui/material";
import React from "react";
import Chart from "react-google-charts";

export function graphSalesData(salesHistory) {
  const sales = Array(12).fill(0);
  const purchases = Array(12).fill(0);
  const recentYearSalesHistory = salesHistory.filter(
    (entry) => entry.year === salesHistory[0].year
  );

  const data = [["Month", "Sales", "Purchases"]];

  recentYearSalesHistory.forEach((entry) => {
    const monthIndex = entry.month - 1; // month is 1-based, array index is 0-based
    sales[monthIndex] = entry.sales;
    purchases[monthIndex] = entry.purchases;
  });

  for (let i = 0; i < 12; i++) {
    const month = (i + 1).toString().padStart(2, "0");
    data.push([month, sales[i], purchases[i]]);
  }

  // Populate the sales array with sales data from salesHistory
  //   recentYearSalesHistory.forEach((entry) => {
  //     const monthIndex = entry.month - 1; // month is 1-based, array index is 0-based
  //     sales[monthIndex] = entry.sales;
  //   });
  //   // setGraphData({ sales: sales });
  return data;
}

const YearlyAnalytics = ({ graphData }) => {
  // const [graphData, setGraphData] = useState({
  //     sales: null,
  //   });
  const options = {
    // title: "",
    legend: { position: "top", maxLines: 3 },
    chart: {
      // title: "Monthly Users",
      subtitle: "Graph depicting monthly sales and Purchases",
    },
    vAxis: {
      title: "Data (Numbers)", // Set the title of the Y-axis
    },
    hAxis: {
      title: "Months", // Set the title of the Y-axis
    },
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        title={<small style={{ fontSize: "18px" }}>Yearly Analytics</small>}
      />
      <Chart
        chartType="LineChart"
        data={graphData}
        // data={graphData}
        options={options}
      />
    </Card>
  );
};

export default YearlyAnalytics;
