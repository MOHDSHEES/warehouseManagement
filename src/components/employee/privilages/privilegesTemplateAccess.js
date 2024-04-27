import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export const PrivilegesTemplatesAccess = ({ state, handleChange }) => {
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Add_Privilege"
              checked={state.Add_Privilege}
              onChange={handleChange}
              label="Add Privileges Templates"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              label="Edit Templates"
              name="Edit_Privilege"
              checked={state.Edit_Privilege}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
