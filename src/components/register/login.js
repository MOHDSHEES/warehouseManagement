import React, { use, useContext, useEffect, useState } from "react";
import axios from "axios";
// import states from "../functions/states";
// import { useNavigate, useParams } from "react-router-dom";
import { closeMessage } from "../functions/message";
import { message } from "antd";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
// import Otp from "../functions/otp";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BackdropComponent from "../UI-component/backdrop";
import { MyContext } from "../context";
import ForgetPassword from "./forgetPassword";
import { Button } from "@mui/material";
// import ForgetPassword from "../modal/forgetPassword";

const Login = () => {
  const [validated, setValidated] = useState(false);
  const [passEye, setPassEye] = useState(false);
  const { messageApi } = useContext(MyContext);
  // const [messageApi, contextHolder] = message.useMessage();
  const [disable, setdisable] = useState(false);
  // const router = useRouter();
  const [modalShow, setModalShow] = useState(false);
  const [open, setOpen] = useState(false);
  // const { isAuth, setIsAuth, setData } = useContext(MyContext);
  // console.log(isAuth);
  const defaultTheme = createTheme();

  const [state, setstate] = useState({
    email: "",
    password: "",
  });
  // function clear() {
  //   setstate({
  //     email: "",
  //     password: "",
  //   });
  // }

  const Inputchange = (event) => {
    const { name, value } = event.target;
    if (name === "email")
      setstate({
        ...state,
        [name]: value.toLowerCase().trim(),
      });
    else
      setstate({
        ...state,
        [name]: value,
      });
  };
  //   console.log(state);
  async function submitHandler(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setOpen(true);
      setdisable(true);
      const result = await signIn("credentials", {
        ...state,
        redirect: false,
        // callbackUrl: "/",
      });
      // const { data: da } = await axios.post("/api/login", {
      //   state,
      // });
      if (result.status === 200) {
        // router.replace("/dashboard");
        setdisable(false);
        setOpen(false);
      } else if (result.status === 401) {
        setOpen(false);
        closeMessage(messageApi, "Wrong credentials...", "error");

        setdisable(false);
      } else {
        setOpen(false);
        closeMessage(messageApi, result.error, "error");
        setdisable(false);
      }

      //   console.log(data);
    }

    setValidated(true);
  }

  return (
    <div>
      <div>
        {/* <section className=" gradient-custom">
          <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-12 col-lg-9 col-xl-7 ">
                <div
                  className="card shadow-2-strong card-registration"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="card-body p-4 p-md-5">
                    <div>
                     
                      <div style={{ textAlign: "center" }}>
                        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Login</h3>
                      </div> */}
        {/* <Layout> */}
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
              <Typography component="h1" variant="h5" className="mb-3">
                Sign in
              </Typography>
              {/* <div className="pb-3">
                      <small>
                        <b>Disclaimer:</b> Your Data security is our priority.
                        It will only be used to keep the record. We will not
                        disclose or share you data with anyone.
                      </small>
                    </div> */}
              {/* <form onSubmit={submitHandler} class="row mt-3 g-3"> */}

              <Form
                class="row mt-3 g-3"
                noValidate
                validated={validated}
                onSubmit={submitHandler}
                style={{ justifyContent: "center", width: "100%" }}
              >
                <Row style={{ padding: 0 }}>
                  <Form.Group
                    className="mb-3"
                    // style={{ padding: 0 }}
                    as={Col}
                    controlId="validationEmail"
                  >
                    <Form.Label>Email *</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        name="email"
                        value={state.email}
                        onChange={Inputchange}
                        placeholder="Enter your email"
                      />
                      <Form.Control.Feedback type="invalid">
                        Enter your email Id
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row style={{ padding: 0 }}>
                  <Form.Group
                    className="mb-3"
                    // style={{ padding: 0 }}
                    as={Col}
                    controlId="validationCustom01"
                  >
                    <Form.Label>Password *</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        className="btn-eye"
                        required
                        type={`${passEye ? "text" : "password"}`}
                        name="password"
                        value={state.password}
                        onChange={Inputchange}
                        placeholder="Enter password"
                        aria-describedby="eye-1"
                      />
                      <InputGroup.Text
                        id="eye-1"
                        onClick={() => setPassEye(!passEye)}
                        style={{
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        {passEye ? (
                          <FontAwesomeIcon icon={faEyeSlash} size="xs" />
                        ) : (
                          <FontAwesomeIcon icon={faEye} size="xs" />
                        )}
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        Enter password
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>

                <div
                  class="col-4 mt-4"
                  style={{ textAlign: "center", margin: "auto" }}
                >
                  <Button variant="contained" disabled={disable} type="submit">
                    Login
                  </Button>
                  {/* <button
                    disabled={disable}
                    type="submit"
                    class="btn btn-primary primary-1"
                  >
                    Login
                  </button> */}
                </div>
                <div className="mt-4">
                  <small className="a-primary">
                    <Link href="/register">
                      Dont&apos;t have an account? SignUp
                    </Link>
                  </small>
                  {/* <small className="a-red">
                    <Link
                      style={{ float: "right", marginLeft: "20px" }}
                      //   variant="primary"
                      href=""
                      onClick={() => setModalShow(true)}
                    >
                      Forget Password?
                    </Link>
                  </small> */}
                </div>
              </Form>
              {/* </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </section> */}
            </Box>
          </Container>
        </ThemeProvider>
        {/* </Layout> */}
      </div>
      <div>
        <BackdropComponent open={open} />
      </div>
      <ForgetPassword show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default Login;
