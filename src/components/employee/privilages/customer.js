import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export const CustomerPrivileges = ({ state, handleChange }) => {
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Add_Customer"
              checked={state.Add_Customer}
              onChange={handleChange}
              label="Add Customer"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Edit_Customer"
              checked={state.Edit_Customer}
              onChange={handleChange}
              label="Edit Customer"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="View_Customer"
              checked={state.View_Customer}
              onChange={handleChange}
              label="View Customer"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Customer_Analytics"
              checked={state.Customer_Analytics}
              onChange={handleChange}
              label="Customer Analytics"
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
