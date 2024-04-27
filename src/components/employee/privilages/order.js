import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export const OrderPrivileges = ({ state, handleChange }) => {
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Create_Order"
              checked={state.Create_Order}
              onChange={handleChange}
              label="Create Order"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="View_Orders"
              checked={state.View_Orders}
              onChange={handleChange}
              label="View Orders"
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
