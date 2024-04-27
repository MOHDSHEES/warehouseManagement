import { Box, Card, CardHeader, Unstable_Grid2 as Grid } from "@mui/material";
import React, { useState } from "react";
import { WarehousePrivilages } from "./warehouse";
import { ShelfPrivilages } from "./shelf";
import { InventoryPrivilages } from "./inventory";
import { GeneralPrivilages } from "./generalAccess";
import { PrivilegesTemplatesAccess } from "./privilegesTemplateAccess";
import { CustomerPrivileges } from "./customer";
import { OrderPrivileges } from "./order";

const Privilages = ({ state, setState, handleChange, disabled = true }) => {
  // console.log(state);
  return (
    <>
      {!disabled && (
        <small>
          <b>Note: </b>Please toggle the switches to enable the privileges you
          wish to set for the Employee.
        </small>
      )}
      <fieldset disabled={disabled}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader title={<small>General Privileges:</small>} />

              <Grid container spacing={3}>
                <GeneralPrivilages
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader
                title={<small>Privilege Template Privileges:</small>}
              />

              <Grid container spacing={3}>
                <PrivilegesTemplatesAccess
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader title={<small>Customer Privileges:</small>} />

              <Grid container spacing={3}>
                <CustomerPrivileges
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader title={<small>Warehouse Privileges:</small>} />

              <Grid container spacing={3}>
                <WarehousePrivilages
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader title={<small>Shelf Privileges:</small>} />

              <Grid container spacing={3}>
                <ShelfPrivilages
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader title={<small>Inventory Privileges:</small>} />

              <Grid container spacing={3}>
                <InventoryPrivilages
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6}>
            <Card sx={{ p: 2 }}>
              <CardHeader title={<small>Order Privileges:</small>} />

              <Grid container spacing={3}>
                <OrderPrivileges
                  state={state}
                  setState={setState}
                  handleChange={handleChange}
                />
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </fieldset>
    </>
  );
};

export default Privilages;
