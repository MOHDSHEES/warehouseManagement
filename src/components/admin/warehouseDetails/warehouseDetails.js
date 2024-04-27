"use client";

import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
            <Box component="form" sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    name="warehouseName"
                    fullWidth
                    defaultValue={data.warehouseName}
                    label="Warehouse Name"
                    size="small"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    name="WarehouseId"
                    label="Warehouse Id"
                    size="small"
                    defaultValue={data._id}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="Employees"
                    label="No. of Employees"
                    size="small"
                    defaultValue={data.users ? data.users.length : 0}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Address"
                    size="small"
                    defaultValue={data.address}
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
    </div>
  );
};

export default WarehouseDetails;
