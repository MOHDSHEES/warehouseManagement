import { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { MyContext } from "../context";

export const AccountProfileDetails = () => {
  const { user } = useContext(MyContext);
  const [disabled, setDisabled] = useState(true);
  const variables = {
    name: user && user.name ? user.name : "",
    address: user && user.address ? user.address : "",
  };
  const [values, setValues] = useState(variables);

  useEffect(() => {
    setValues(variables);
  }, [user]);
  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    console.log(values);
  }, []);

  return (
    <form autoComplete="off">
      <fieldset disabled={disabled}>
        <Card sx={{ p: 2 }}>
          <CardHeader title="Profile" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    // helperText="Please specify the first name"
                    label="name"
                    name="name"
                    onChange={handleChange}
                    required
                    value={values.name}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="email"
                    name="email"
                    // onChange={handleChange}
                    required
                    value={user && user.email ? user.email : ""}
                  />
                </Grid>
                {/* <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee Id"
                    name="employeeId"
                    // onChange={handleChange}
                    required
                    value={user && user.employeeId ? user.employeeId : ""}
                  />
                </Grid> */}
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Joining Date"
                    name="joiningDate"
                    // onChange={handleChange}
                    required
                    value={user && user.joiningDate ? user.joiningDate : ""}
                  />
                </Grid>
                {user && user.completionDate && (
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Joining Date"
                      name="joiningDate"
                      // onChange={handleChange}
                      required
                      value={user.completionDate}
                    />
                  </Grid>
                )}
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    onChange={handleChange}
                    required
                    value={`${
                      user && user.address
                      // ", " +
                      // capital(user.district) +
                      // ", " +
                      // user.state +
                      // ", " +
                      // user.pincode
                    }`}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          {!disabled && (
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <button className="btn btn-primary primary-1" type="submit">
                Update details
              </button>
            </CardActions>
          )}
        </Card>
      </fieldset>
    </form>
  );
};
