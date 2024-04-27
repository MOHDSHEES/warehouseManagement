import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export const WarehousePrivilages = ({ state, handleChange }) => {
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Add Warehouse"
              name="Add_Warehouse"
              checked={state.Add_Warehouse}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Edit Warehouse"
              name="Edit_Warehouse"
              checked={state.Edit_Warehouse}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
