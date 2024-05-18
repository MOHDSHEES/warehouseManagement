"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import YearlyAnalytics, {
  graphSalesData,
} from "@/src/components/analytics/productAnalytics/yearlyAnalytics";
import OverallAnalytics from "@/src/components/analytics/productAnalytics/overallAnalytics";
import CurrentMonthAnalytics from "@/src/components/analytics/productAnalytics/currentMonthAnalytics";
import RecentVpreComparison from "@/src/components/analytics/productAnalytics/recentVpreComparison";
import ProductDetails from "@/src/components/analytics/productAnalytics/productDetails";

const defaultTheme = createTheme();

const ProductAnalytics = ({ params }) => {
  const { user, messageApi } = useContext(MyContext);
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState("loading");
  const [comparisonSales, setComparisonSales] = useState(null);
  const [graphData, setGraphData] = useState(null);
  //   console.log(comparisonSales);

  //   console.log(data);
  const [loading, setLoading] = useState(false);
  async function getAnalytics() {
    setLoading(true);
    const { data } = await axios.post("/api/analytics/product", {
      productId: params.productId,
      warehouse: params.id,
      company: user.company,
    });
    if (data.status === 200) {
      setData(data.data);
      setAnalytics(data.data.analytics);
      data.data.analytics && previousMonthComparison(data.data.analytics);
    } else closeMessage(messageApi, data.msg, "error");
    setLoading(false);
  }

  useEffect(() => {
    if (!loading && !data) getAnalytics();
  }, [params.productId, loading, data]);

  function previousMonthComparison(analytics) {
    const data = analytics;
    // Sort sales history in descending order based on year and month
    data.salesHistory.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; // Descending order by year
      }
      return b.month - a.month; // Descending order by month
    });
    setGraphData(graphSalesData(data.salesHistory));
    const twoMonthSaleHistory = data.salesHistory.slice(0, 2);
    const [currentMonth, previousMonth] = twoMonthSaleHistory;

    // Calculate comparisons for sales and purchases
    const salesPercentageChange = previousMonth
      ? ((currentMonth.sales - previousMonth.sales) / previousMonth.sales) * 100
      : currentMonth.sales;
    const purchasesPercentageChange = previousMonth
      ? ((currentMonth.purchases - previousMonth.purchases) /
          previousMonth.purchases) *
        100
      : currentMonth.purchases;

    // Determine comparison status (positive/negative)
    const salesComparisonPositive = salesPercentageChange > 0 ? true : false;
    const purchasesComparisonPositive =
      purchasesPercentageChange > 0 ? true : false;

    // Result object with sales, purchases, and comparison statuses
    const comparison = {
      sales: currentMonth.sales,
      purchases: currentMonth.purchases,
      salesPercentageChange,
      purchasesPercentageChange,
      salesComparisonPositive,
      purchasesComparisonPositive,
      number: previousMonth ? false : true,
      recentMonthData: currentMonth,
      sortedSalesHistory: data.salesHistory,
    };
    setComparisonSales(comparison);
  }

  console.log(data);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl">
        {/* <CssBaseline /> */}
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Product Analytics</Typography>
            {/* <button onClick={test} className="btn btn-primary">
          test
        </button> */}
          </div>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 3,
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12} md={12} lg={12}>
                {data && <ProductDetails data={data.product} />}
              </Grid>
            </Grid>
            {analytics === "loading" ? (
              "Loading..."
            ) : !analytics ? (
              <Alert severity="info">
                No analytics available for this product.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={6}>
                  <OverallAnalytics analytics={analytics} />
                </Grid>
                <Grid xs={12} md={6} lg={6}>
                  <CurrentMonthAnalytics comparisonSales={comparisonSales} />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={6}>
                <RecentVpreComparison comparisonSales={comparisonSales} />
              </Grid>
              {graphData && (
                <Grid xs={12} md={6} lg={6}>
                  <YearlyAnalytics
                    graphData={graphData}
                    setGraphData={setGraphData}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default ProductAnalytics;
