"use client";
import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { MyContext } from "../../context";
import { closeMessage, openMessage } from "../../functions/message";

const defaultTheme = createTheme();

export default function AddShelf({ warehouseId }) {
  // boolean hook (true if signUp btn is disabled)
  const { messageApi, user, setWarehouses, warehouses } = useContext(MyContext);
  const [disable, setdisable] = useState(false);
  const router = useRouter();
  const [state, setstate] = useState({
    shelfName: "",
    warehouse: warehouseId,
  });
  function clear() {
    setstate({
      shelfName: "",
      warehouse: warehouseId,
    });
  }
  useEffect(() => {
    setstate({ ...state, warehouse: warehouseId });
  }, [warehouseId]);
  //   const Inputchange = (event) => {
  //     const { name, value } = event.target;
  //     setstate({
  //       ...state,
  //       [name]: value.trim(),
  //     });
  //   };
  async function submitHandler(e) {
    e.preventDefault();
    setdisable(true);
    openMessage(messageApi, "Adding Shelf...");
    if (user && user._id) {
      const { data } = await axios.post("/api/shelf/add", {
        detail: { ...state, shelfPath: state.shelfName },
      });
      if (data && data.status === 200) {
        // setUser(data.data);
        if (warehouses) {
          const updatedData = warehouses.map((warehouse) => {
            if (warehouse._id === data.data._id) {
              return data.data;
            }
            return warehouse;
          });
          setWarehouses(updatedData);
        }
        clear();
        router.push("/dashboard/warehouses");
        closeMessage(messageApi, "Shelf Sucessfully added", "success");
      } else if (
        data &&
        data.status === 500 &&
        data.msg.split(" ")[0] === "E11000"
      )
        closeMessage(
          messageApi,
          "Shelf already registered with this name.",
          "error"
        );
    } else signOut();
    setdisable(false);
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography> */}

          <Box
            component="form"
            // noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="shelfName"
                  required
                  fullWidth
                  id="shelfName"
                  value={state.shelfName}
                  onChange={(e) =>
                    setstate({
                      ...state,
                      shelfName: e.target.value.toUpperCase(),
                    })
                  }
                  label="shelf Name  or Id"
                  autoFocus
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={state.lname}
                  onChange={Inputchange}
                  name="lname"
                  autoComplete="family-name"
                />
              </Grid> */}

              {/* <Grid item xs={12}>
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
              </Grid> */}
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
            {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
