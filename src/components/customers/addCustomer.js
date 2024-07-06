import React, { useContext, useState } from "react";
import { Button, Card, CardActions, CardContent, Divider } from "@mui/material";
import Form from "react-bootstrap/Form";
import AddCustomerForm from "./addCustomerForm";
import axios from "axios";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";

const AddCustomer = () => {
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { user, messageApi } = useContext(MyContext);
  const options = {
    name: "",
    email: "",
    customerType: "",
    mobileNo: "",
    address: "",
  };
  const [state, setState] = useState(options);

  const Inputchange = (event) => {
    setValidated(false);
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  function clear() {
    setState(options);
  }
  async function submitHandler(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      setDisabled(true);
      openMessage(messageApi, "registering...");
      const { data } = await axios.post("/api/customer/add", {
        data: { ...state, company: user.company },
      });
      // console.log(data);
      if (data.status === 200) {
        setValidated(false);
        clear();
        closeMessage(messageApi, "Customer registered Successfully", "success");
      } else if (data.msg.split(" ")[0] === "E11000") {
        setValidated(false);
        closeMessage(messageApi, "Email alreday registered", "error");
      } else {
        setValidated(true);
        closeMessage(messageApi, data.msg, "error");
      }
      setDisabled(false);
    }
  }
  return (
    <Form noValidate validated={validated} onSubmit={submitHandler}>
      {/* <small id="emailHelp" class="form-text text-muted mb-3">
        Link generated can be used only once.
      </small> */}
      <Card>
        {/* <CardHeader subheader="Update password" title="Password" />
        <h5>Register</h5> */}
        <Divider />
        <CardContent>
          <AddCustomerForm state={state} Inputchange={Inputchange} />
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button disabled={disabled} variant="contained" type="submit">
            Add
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
};

export default AddCustomer;
