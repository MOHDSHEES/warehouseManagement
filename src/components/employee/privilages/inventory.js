import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export const InventoryPrivilages = ({ state, handleChange }) => {
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Out_Of_Stock"
              checked={state.Out_Of_Stock}
              onChange={handleChange}
              label="Out of Stock"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Register Product"
              name="Register_Product"
              checked={state.Register_Product}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Update Product"
              name="Update_Product"
              checked={state.Update_Product}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
