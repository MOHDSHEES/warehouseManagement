import React from "react";
import { ProductStatsCard } from "../../admin/productDetails/productStatsCard";
import { Card, CardHeader, Unstable_Grid2 as Grid } from "@mui/material";
import formatMoney from "../../functions/formatMoney";

const RecentVpreComparison = ({ comparisonSales }) => {
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
              data={formatMoney(comparisonSales.purchases)}
              color="success.main"
              variant="h4"
              icon={false}
              difference={formatMoney(
                Math.abs(comparisonSales.purchasesPercentageChange.toFixed(1))
              )}
              positive={comparisonSales.purchasesComparisonPositive}
              number={comparisonSales.number}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          {comparisonSales && comparisonSales.sales && (
            <ProductStatsCard
              title="Total Sales"
              data={formatMoney(comparisonSales.sales)}
              color="success.main"
              variant="h4"
              icon={false}
              difference={formatMoney(
                Math.abs(comparisonSales.salesPercentageChange.toFixed(1))
              )}
              positive={comparisonSales.salesComparisonPositive}
              number={comparisonSales.number}
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default RecentVpreComparison;
