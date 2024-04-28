"use client";

import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Box, Unstable_Grid2 as Grid, Skeleton } from "@mui/material";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { ProductStatsCard } from "../productDetails/productStatsCard";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";

const defaultTheme = createTheme();

const WarehouseDetails = ({ warehouseDetails: data }) => {
  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xl" sx={{ padding: 0 }}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!data ? (
              <Grid container sx={{ width: "100%" }} spacing={2}>
                <Grid xs={12} sm={4}>
                  <Skeleton variant="rounded" height={80} />
                </Grid>
                <Grid xs={12} sm={4}>
                  <Skeleton variant="rounded" height={80} />
                </Grid>
                <Grid xs={12} sm={4}>
                  <Skeleton variant="rounded" height={80} />
                </Grid>
                <Grid xs={12} sm={12}>
                  <Skeleton variant="rounded" height={80} />
                </Grid>
              </Grid>
            ) : (
              <Box
                component="main"
                sx={{
                  // flexGrow: 1,
                  py: 3,
                }}
              >
                {/* <Container maxWidth="xl"> */}
                <Grid container spacing={2}>
                  <Grid xs={12} sm={4} lg={4}>
                    <ProductStatsCard
                      title="Warehouse Name"
                      data={data.warehouseName}
                      color="success.main"
                      variant="subtitle2"
                      icon={false}
                    />
                  </Grid>
                  <Grid xs={12} sm={4} lg={4}>
                    <ProductStatsCard
                      title="Warehouse Id"
                      data={data._id}
                      color="warning.main"
                      variant="subtitle2"
                      icon={false}
                    />
                  </Grid>
                  <Grid xs={12} sm={4} lg={4}>
                    <ProductStatsCard
                      title="No. of Employees"
                      data={data.users ? data.users.length : 0}
                      color="success.main"
                      variant="subtitle2"
                      iconData={<PeopleIcon />}
                      // icon={false}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} lg={12}>
                    <ProductStatsCard
                      title="Address"
                      data={data.address}
                      color="primary.main"
                      variant="subtitle2"
                      iconData={<HomeIcon />}
                    />
                  </Grid>
                </Grid>
              </Box>

              // <Box component="form" sx={{ mt: 1 }}>
              //   <Grid container spacing={2}>
              //     <Grid item xs={12} sm={5}>
              //       <TextField
              //         name="warehouseName"
              //         fullWidth
              //         defaultValue={data.warehouseName}
              //         label="Warehouse Name"
              //         size="small"
              //         InputProps={{
              //           readOnly: true,
              //         }}
              //         variant="filled"
              //       />
              //     </Grid>

              //     <Grid item xs={12} sm={5}>
              //       <TextField
              //         fullWidth
              //         name="WarehouseId"
              //         label="Warehouse Id"
              //         size="small"
              //         defaultValue={data._id}
              //         InputProps={{
              //           readOnly: true,
              //         }}
              //         variant="filled"
              //       />
              //     </Grid>
              //     <Grid item xs={12} sm={2}>
              //       <TextField
              //         fullWidth
              //         name="Employees"
              //         label="No. of Employees"
              //         size="small"
              //         defaultValue={data.users ? data.users.length : 0}
              //         InputProps={{
              //           readOnly: true,
              //         }}
              //         variant="filled"
              //       />
              //     </Grid>
              //     <Grid item xs={12}>
              //       <TextField
              //         fullWidth
              //         name="address"
              //         label="Address"
              //         size="small"
              //         defaultValue={data.address}
              //         InputProps={{
              //           readOnly: true,
              //         }}
              //         variant="filled"
              //       />
              //     </Grid>
              //   </Grid>
              // </Box>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default WarehouseDetails;
