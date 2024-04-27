"use client";
import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
// import Form from "react-bootstrap/Form";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";
import { useRouter } from "next/navigation";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";
import { signOut, useSession } from "next-auth/react";

const defaultTheme = createTheme();

export default function AddWareHouse() {
  // boolean hook (true if signUp btn is disabled)
  const { messageApi, user, setUser, setWarehouses } = useContext(MyContext);
  const [disable, setdisable] = useState(false);
  const router = useRouter();
  // const { data: session, update } = useSession();
  // console.log(session);
  const [state, setstate] = useState({
    warehouseName: "",
    address: "",
  });
  const Inputchange = (event) => {
    const { name, value } = event.target;
    setstate({
      ...state,
      [name]: value.trim(),
    });
  };
  async function submitHandler(e) {
    e.preventDefault();
    setdisable(true);
    openMessage(messageApi, "Adding warehouse...");
    if (user && user._id) {
      const { data } = await axios.post("/api/warehouse/add", {
        detail: state,
        companyId: user.company._id,
        userEmail: user.email,
      });
      if (data && data.status === 200) {
        // update(data.data);
        setUser(data.data);
        const { data: warehouses } = await axios.post(
          "/api/warehouse/getDetails",
          {
            ids: data.data.company.warehouses,
          }
        );
        if (warehouses.status === 200) {
          setWarehouses(warehouses.data);
        }

        // update((prev) => {...prev: foo: "new session value"})
        router.push("/dashboard/warehouses");
        closeMessage(messageApi, "Warehouse Sucessfully added", "success");
      } else if (
        data &&
        data.status === 500 &&
        data.msg.split(" ")[0] === "E11000"
      )
        closeMessage(
          messageApi,
          "Warehouse already registered with this name.",
          "error"
        );
    } else signOut();
    setdisable(false);
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            // noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="warehouseName"
                  required
                  fullWidth
                  id="warehouseName"
                  value={state.warehouseName}
                  onChange={Inputchange}
                  label="WareHouse Name  or Id"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  value={state.address}
                  onChange={Inputchange}
                  id="address"
                  autoComplete="address"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              disabled={disable}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
