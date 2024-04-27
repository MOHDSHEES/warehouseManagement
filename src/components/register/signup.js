"use client";
import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import Form from "react-bootstrap/Form";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Otp from "./otp";
import { closeMessage, openMessage } from "../functions/message";
import { MyContext } from "../context";
import axios from "axios";
import { useRouter } from "next/navigation";

const defaultTheme = createTheme();

export default function SignUp() {
  // boolean hook (true if email is verified)
  const [isVerified, setisVerified] = useState(false);
  // boolean hook (true if signUp btn is disabled)
  const { messageApi } = useContext(MyContext);
  const [disable, setdisable] = useState(true);
  const router = useRouter();
  const [state, setstate] = useState({
    companyName: "",
    email: "",
    password: "",
    address: "",
  });
  const [cpassword, setcpassword] = useState("");

  const Inputchange = (event) => {
    const { name, value } = event.target;
    if (name === "address" || name === "companyName")
      setstate({
        ...state,
        [name]: value,
      });
    else
      setstate({
        ...state,
        [name]: value.trim(),
      });
  };
  async function submitHandler(e) {
    e.preventDefault();
    if (state.password === cpassword) {
      if (isVerified) {
        setdisable(true);
        openMessage(messageApi, "Registering, Please wait...");
        const { data } = await axios.post("/api/user/save/", {
          detail: {
            ...state,
            companyName: state.companyName.trim(),
            address: state.address.trim(),
          },
        });
        if (data && data.user && data.user._id) {
          closeMessage(messageApi, "Sucessfully Registered", "success");
          //   navigate("/edit", { replace: true });
          router.replace("/login");
        } else if (data && data.msg.split(" ")[0] === "E11000")
          closeMessage(
            messageApi,
            "Email Id already registered with us",
            "error"
          );
        else closeMessage(messageApi, data.msg, "error");
      } else closeMessage(messageApi, "Please verify email", "error");
    } else closeMessage(messageApi, "Password Missmatch", "error");
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Box
            component="form"
            // noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="companyName"
                  required
                  fullWidth
                  id="compannyName"
                  value={state.companyName}
                  onChange={Inputchange}
                  label="Company Name"
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
              <Grid item xs={12}>
                <Otp
                  disable={setdisable}
                  setstate={setstate}
                  setisVerified={setisVerified}
                  isVerified={isVerified}
                  state={state}
                />
                {/* <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                /> */}
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  value={state.password}
                  onChange={Inputchange}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="cpassword"
                  label="Confirm Password"
                  value={cpassword}
                  onChange={(e) => setcpassword(e.target.value.trim())}
                  type="password"
                  id="cpassword"
                  autoComplete="new-password"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
