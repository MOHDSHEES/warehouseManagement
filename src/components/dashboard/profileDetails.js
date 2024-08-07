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
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import { MyContext } from "../context";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import axios from "axios";
import { closeMessage, openMessage } from "../functions/message";

export const AccountProfileDetails = () => {
  const { user, isAdmin, messageApi, setUser } = useContext(MyContext);
  const [disabled, setDisabled] = useState(true);
  const variables = {
    name: user && user.name ? user.name : "",
    address: user && user.address ? user.address : "",
  };
  const [values, setValues] = useState(variables);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(variables);
  }, [user]);
  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  function handleEdit() {
    setDisabled(!disabled);
    setValues(variables);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // setLoading(true);
    setDisabled(true);
    openMessage(messageApi, "Updating...");
    const { data } = await axios.post("/api/user/update", {
      data: values,
      userId: user._id,
    });
    // console.log(data);
    if (data.status === 200 && data.data._id) {
      closeMessage(messageApi, "Updated Successfully", "success");
      setUser({ ...user, name: data.data.name, address: data.data.address });
    } else {
      setValues(variables);
      closeMessage(messageApi, data.msg, "error");
    }
  }
  // const handleSubmit = useCallback((event) => {
  //   event.preventDefault();
  //   console.log(values);
  // }, []);
  // console.log(disabled);
  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Card sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CardHeader title="Profile" />
          <IconButton
            // size="small"
            onClick={handleEdit}
            style={{ marginLeft: "auto", marginRight: "20px" }}
            aria-label="Edit"
          >
            {disabled ? (
              <EditIcon fontSize="small" />
            ) : (
              <EditOffIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>
        <fieldset disabled={disabled}>
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
                    // disabled
                    fullWidth
                    label="email"
                    name="email"
                    InputProps={{
                      readOnly: true,
                    }}
                    // onChange={handleChange}
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
                {!isAdmin && (
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Joining Date"
                      name="joiningDate"
                      InputProps={{
                        readOnly: true,
                      }}
                      // onChange={handleChange}
                      value={user && user.joiningDate ? user.joiningDate : ""}
                    />
                  </Grid>
                )}
                {/* {user && user.completionDate && (
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
                )} */}
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    onChange={handleChange}
                    required
                    value={`${
                      values.address
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
        </fieldset>
        <Divider />
        {!disabled && (
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained" type="submit">
              Update details
            </Button>
          </CardActions>
        )}
      </Card>
    </form>
  );
};
