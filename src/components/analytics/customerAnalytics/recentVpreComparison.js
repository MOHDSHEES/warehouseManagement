import React from "react";
import { ProductStatsCard } from "../../admin/productDetails/productStatsCard";
import { Card, CardHeader, Unstable_Grid2 as Grid } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import formatMoney from "../../functions/formatMoney";

const CustomerRecentVpreComparison = ({ comparisonSales }) => {
  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        title={
          <small style={{ fontSize: "18px" }}>
            Recent vs. Previous Month Analysis
          </small>
        }
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={6}>
          {comparisonSales && comparisonSales.purchases && (
            <ProductStatsCard
              title="Total Purchases"
              data={comparisonSales.purchases}
              color="success.main"
              variant="h4"
              icon={false}
              difference={Math.abs(
                comparisonSales.purchasesPercentageChange.toFixed(1)
              )}
              positive={comparisonSales.purchasesComparisonPositive}
              number={comparisonSales.number}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          {comparisonSales && comparisonSales.spent && (
            <ProductStatsCard
              title="Total Spent"
              data={formatMoney(comparisonSales.spent)}
              color="success.main"
              variant="h4"
              iconData={<AnalyticsIcon />}
              difference={Math.abs(
                comparisonSales.spentPercentageChange.toFixed(1)
              )}
              positive={comparisonSales.spentComparisonPositive}
              number={comparisonSales.number}
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CustomerRecentVpreComparison;
