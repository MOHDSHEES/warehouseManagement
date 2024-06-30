"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";
import {
  Alert,
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import OverallCustomerAnalytics from "@/src/components/analytics/customerAnalytics/overallAnalytics";
import CustomerCurrentMonthAnalytics from "@/src/components/analytics/customerAnalytics/customerCurrentMonthAnalytics";
import CustomerRecentVpreComparison from "@/src/components/analytics/customerAnalytics/recentVpreComparison";
import { CustomergraphSalesData } from "@/src/components/analytics/customerAnalytics/customerGraphSalesData";
import LineChartGraph from "@/src/components/analytics/customerAnalytics/LineChartGraph";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import CustomerDetails from "@/src/components/analytics/customerAnalytics/customerDetails";

const defaultTheme = createTheme();

const CustomerAnalytics = ({ params }) => {
  const { messageApi } = useContext(MyContext);
  // const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState("loading");
  const [comparisonSales, setComparisonSales] = useState(null);
  const [graphData, setGraphData] = useState(null);
  //   console.log(comparisonSales);
  // console.log(comparisonSales);
  // console.log(graphData);

  //   console.log(data);
  const [loading, setLoading] = useState(false);
  async function getAnalytics() {
    setLoading(true);
    const { data } = await axios.post("/api/analytics/customer", {
      customerId: params.customerId,
      // company: user.company,
    });
    if (data.status === 200) {
      setAnalytics(data.data);
      data.data && previousMonthComparison(data.data);
    } else closeMessage(messageApi, data.msg, "error");
    setLoading(false);
  }

  // console.log(graphData);
  useEffect(() => {
    if (!loading && analytics === "loading") getAnalytics();
  }, [params.customerId, loading]);

  function previousMonthComparison(analytics) {
    const data = analytics;
    // console.log(data);
    // Sort sales history in descending order based on year and month
    // const sortedHistory = [...data.purchaseHistory].sort((a, b) => {
    //   if (a.year !== b.year) {
    //     return b.year - a.year; // Descending order by year
    //   }
    //   return b.month - a.month; // Descending order by month
    // });
    setGraphData(CustomergraphSalesData(data.purchaseHistory));
    const twoMonthPurchaseHistory = data.purchaseHistory.slice(0, 2);
    const [currentMonth, previousMonth] = twoMonthPurchaseHistory;

    // Calculate comparisons for sales and purchases
    const spentPercentageChange = previousMonth
      ? ((currentMonth.totalSpent - previousMonth.totalSpent) /
          previousMonth.totalSpent) *
        100
      : currentMonth.totalSpent;
    const purchasesPercentageChange = previousMonth
      ? ((currentMonth.totalPurchases - previousMonth.totalPurchases) /
          previousMonth.totalPurchases) *
        100
      : currentMonth.totalPurchases;

    // Determine comparison status (positive/negative)
    const spentComparisonPositive = spentPercentageChange > 0 ? true : false;
    const purchasesComparisonPositive =
      purchasesPercentageChange > 0 ? true : false;

    // Result object with sales, purchases, and comparison statuses
    const comparison = {
      spent: currentMonth.totalSpent,
      purchases: currentMonth.totalPurchases,
      spentPercentageChange,
      purchasesPercentageChange,
      spentComparisonPositive,
      purchasesComparisonPositive,
      number: previousMonth ? false : true,
      recentMonthData: currentMonth,
      // sortedSalesHistory: data.purchaseHistory,
    };
    setComparisonSales(comparison);
  }

  return (
    <UserAccessLayout>
      <ThemeProvider requiredprivilege="View_Customer" theme={defaultTheme}>
        <Container component="main" maxWidth="xl">
          {/* <CssBaseline /> */}
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Customer Analytics</Typography>
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
              {/* <Grid container spacing={3}>
              <Grid xs={12} md={12} lg={12}>
                {data && <ProductDetails data={data.product} />}
              </Grid>
            </Grid> */}
              {analytics === "loading" ? (
                "Loading..."
              ) : !analytics ? (
                <Alert severity="info">
                  No analytics available for this customer.
                </Alert>
              ) : (
                <>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={12} lg={6}>
                      <CustomerDetails data={analytics.customerId} />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={12} lg={12}>
                      <OverallCustomerAnalytics analytics={analytics} />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={6} lg={6}>
                      <CustomerCurrentMonthAnalytics
                        comparisonSales={comparisonSales}
                      />
                    </Grid>
                    <Grid xs={12} md={6} lg={6}>
                      <CustomerRecentVpreComparison
                        comparisonSales={comparisonSales}
                      />
                      {/* <RecentVpreComparison comparisonSales={comparisonSales} /> */}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    {graphData && graphData.purchasesData && (
                      <Grid xs={12} md={6} lg={6}>
                        <LineChartGraph
                          graphData={graphData.purchasesData}
                          vAxis="Purchases"
                          subTitle="Graph depicting monthly Purchases"
                          title="Yearly Purchases"
                          color="#028391"
                        />
                      </Grid>
                    )}
                    {graphData && graphData.spentData && (
                      <Grid xs={12} md={6} lg={6}>
                        <LineChartGraph
                          graphData={graphData.spentData}
                          vAxis="Spent"
                          title="Yearly Spent"
                          subTitle="Graph depicting monthly spent"
                          color="#850F8D"
                        />
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </Box>
          </Stack>
        </Container>
      </ThemeProvider>
    </UserAccessLayout>
  );
};

export default CustomerAnalytics;
