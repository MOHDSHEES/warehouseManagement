import {
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
// import { useState } from "react";

export const GeneralPrivilages = ({ state, setState, handleChange }) => {
  const customHandleChange = (event) => {
    const { name, checked } = event.target;
    setState({
      ...state,
      [name]: checked,
      // Automatically check "View Employee" if "Edit Employee" is checked
      ...(name === "Edit_Employee" && checked && !state.View_Employee
        ? { View_Employee: true }
        : {}),
      // Automatically uncheck "Edit Employee" if "View Employee" is unchecked
      ...(name === "View_Employee" && !checked && state.Edit_Employee
        ? { Edit_Employee: false }
        : {}),
    });
  };
  return (
    <CardContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Add_Employee"
              checked={state.Add_Employee}
              onChange={handleChange}
              label="Add Employee"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="View_Employee"
              checked={state.View_Employee}
              onChange={customHandleChange}
              label="View Employee"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch size="small" sx={{ marginRight: "5px" }} />}
              name="Edit_Employee"
              checked={state.Edit_Employee}
              onChange={customHandleChange}
              label="Edit Employee"
            />
          </Grid>
        </Grid>
      </FormGroup>
    </CardContent>
  );
};
