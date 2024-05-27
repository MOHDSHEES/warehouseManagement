import React from "react";
import { ProductStatsCard } from "../../admin/productDetails/productStatsCard";
import { Card, CardHeader, Unstable_Grid2 as Grid } from "@mui/material";
import formatMoney from "../../functions/formatMoney";

const OverallAnalytics = ({ analytics }) => {
  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        title={<small style={{ fontSize: "18px" }}>Overall Analytics</small>}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={6}>
          {analytics && analytics.purchases && (
            <ProductStatsCard
              title="Total Purchases"
              data={analytics.purchases}
              color="success.main"
              variant="h4"
              icon={false}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          {analytics && analytics.totalSales && (
            <ProductStatsCard
              title="Total Sales"
              data={formatMoney(analytics.totalSales)}
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

export default OverallAnalytics;
