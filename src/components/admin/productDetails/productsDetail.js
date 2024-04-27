"use client";

import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

const ProductsDetail = ({ productIdsData, outOfStockData }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl" sx={{ padding: 0 }}>
        <CssBaseline />
        <Box
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
              </Grid>
              <Grid item xs={12} sm={4}>
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
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProductsDetail;
