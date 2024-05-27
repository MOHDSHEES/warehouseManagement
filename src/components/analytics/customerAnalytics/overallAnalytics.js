import React from "react";
import { ProductStatsCard } from "../../admin/productDetails/productStatsCard";
import { Card, CardHeader, Unstable_Grid2 as Grid } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import formatMoney from "../../functions/formatMoney";

const OverallCustomerAnalytics = ({ analytics }) => {
  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        title={<small style={{ fontSize: "18px" }}>Overall Analytics</small>}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={4} lg={4}>
          {analytics && analytics.totalPurchases && (
            <ProductStatsCard
              title="Total Purchases"
              data={analytics.totalPurchases}
              color="rgba(109, 81, 146, 1.00)"
              variant="h4"
              iconData={<Inventory2Icon />}
            />
          )}
        </Grid>
        <Grid xs={12} md={4} lg={4}>
          {analytics && analytics.totalSpent && (
            <ProductStatsCard
              title="Total Spent"
              data={formatMoney(analytics.totalSpent)}
              color="success.main"
              variant="h4"
              iconData={<AttachMoneyIcon />}
            />
          )}
        </Grid>
        <Grid xs={12} md={4} lg={4}>
          {analytics && analytics.totalSpent && analytics.totalPurchases && (
            <ProductStatsCard
              title="Average Spent"
              data={formatMoney(
                (analytics.totalSpent / analytics.totalPurchases).toFixed(2)
              )}
              color="primary.main"
              variant="h4"
              iconData={<AttachMoneyIcon />}
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default OverallCustomerAnalytics;
