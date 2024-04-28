"use client";

import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Unstable_Grid2 as Grid, Skeleton } from "@mui/material";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ProductStatsCard } from "./productStatsCard";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const defaultTheme = createTheme();

const ProductsDetail = ({ productIdsData, outOfStockData }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl" sx={{ padding: 0 }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
          }}
        >
          {/* <Container maxWidth="xl"> */}
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={4}>
              {productIdsData ? (
                <ProductStatsCard
                  title="Total Products"
                  data={productIdsData && productIdsData.length}
                  color="success.main"
                  iconData={<ShowChartIcon />}
                />
              ) : (
                <Skeleton variant="rounded" height={120} />
              )}
            </Grid>
            <Grid xs={12} sm={6} lg={4}>
              {outOfStockData ? (
                <ProductStatsCard
                  title="Out Of Stock"
                  data={outOfStockData ? outOfStockData.count : 0}
                  color="warning.main"
                  iconData={<ShowChartIcon />}
                />
              ) : (
                <Skeleton variant="rounded" height={120} />
              )}
            </Grid>
          </Grid>
        </Box>
        {/* <Box
          sx={{
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" sx={{ width: "100%", mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                {productIdsData ? (
                  <TextField
                    name="products"
                    fullWidth
                    value={productIdsData && productIdsData.length}
                    label="Total products"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                ) : (
                  <Skeleton variant="rounded" height={60} />
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {outOfStockData ? (
                  <TextField
                    name="products"
                    fullWidth
                    // defaultValue={outOfStockData ? outOfStockData.count : 0}
                    value={outOfStockData ? outOfStockData.count : 0}
                    label="Out Of Stock Products"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                ) : (
                  <Skeleton variant="rounded" height={60} />
                )}
              </Grid>
            </Grid>
          </Box>
        </Box> */}
      </Container>
    </ThemeProvider>
  );
};

export default ProductsDetail;
