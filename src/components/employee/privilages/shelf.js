import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export const ShelfPrivilages = ({ state, handleChange }) => {
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Add_Shelf"
              checked={state.Add_Shelf}
              onChange={handleChange}
              label="Add Shelf/SubShelf"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Delete Shelf"
              name="Delete_Shelf"
              checked={state.Delete_Shelf}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Add Product On Shelf"
              name="Add_Product_To_Shelf"
              checked={state.Add_Product_To_Shelf}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
