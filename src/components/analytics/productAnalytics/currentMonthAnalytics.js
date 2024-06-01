import React from "react";
import { ProductStatsCard } from "../../admin/productDetails/productStatsCard";
import { Card, CardHeader, Unstable_Grid2 as Grid } from "@mui/material";
import formatMoney from "../../functions/formatMoney";

const CurrentMonthAnalytics = ({ comparisonSales }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        title={
          <small style={{ fontSize: "18px" }}>Current Month Analytics</small>
        }
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={6}>
          {comparisonSales && comparisonSales.purchases && (
            <ProductStatsCard
              title="Total Purchases"
              data={
                comparisonSales.recentMonthData.month === currentMonth &&
                comparisonSales.recentMonthData.year === currentYear
                  ? formatMoney(comparisonSales.recentMonthData.purchases)
                  : 0
              }
              color="success.main"
              variant="h4"
              icon={false}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          {comparisonSales && comparisonSales.sales && (
            <ProductStatsCard
              title="Total Sales"
              data={
                comparisonSales.recentMonthData.month === currentMonth &&
                comparisonSales.recentMonthData.year === currentYear
                  ? formatMoney(comparisonSales.recentMonthData.sales)
                  : 0
              }
              color="success.main"
              variant="h4"
              icon={false}
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CurrentMonthAnalytics;
