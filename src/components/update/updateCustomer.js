import React, { Fragment, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddCustomerForm from "../customers/addCustomerForm";
import Form from "react-bootstrap/Form";
import { closeMessage, openMessage } from "../functions/message";
import { MyContext } from "../context";
import axios from "axios";

export default function UpdateCustomerDetails({
  open,
  setOpen,
  customerClicked,
  handleCustomerMenuModel,
  setCustomers,
  customers,
}) {
  const options = {
    name: "",
    email: "",
    customerType: "",
    mobileNo: "",
    address: "",
  };
  const [state, setState] = useState(options);
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { user, messageApi } = useContext(MyContext);

  useEffect(() => {
    if (customerClicked)
      setState({
        name: customerClicked.name ? customerClicked.name : "",
        email: customerClicked.email ? customerClicked.email : "",
        customerType: customerClicked.customerType
          ? customerClicked.customerType
          : "",
        mobileNo: customerClicked.mobileNo ? customerClicked.mobileNo : "",
        address: customerClicked.address ? customerClicked.address : "",
      });
  }, [customerClicked]);
  const Inputchange = (event) => {
    setValidated(false);
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  const handleClose = () => {
    setOpen(false);
    handleCustomerMenuModel();
  };

  async function submitHandler(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      setDisabled(true);
      openMessage(messageApi, "Updating...");
      const { data } = await axios.post("/api/customer/update", {
        data: state,
        company: user.company,
        customerId: customerClicked._id,
      });
      if (data.status === 200) {
        setValidated(false);
        const updatedCustomers = customers.map((customer) => {
          if (customer._id === data.data._id) {
            return data.data; // Merge existing object with updated data
          }
          return customer;
        });
        // clear();
        setCustomers(updatedCustomers);
        closeMessage(messageApi, "Customer Updated Successfully", "success");
        handleClose();
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
    <Fragment>
      <Dialog open={open} maxWidth="lg" onClose={handleClose}>
        <DialogTitle>Update:</DialogTitle>
        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <DialogContent>
            <AddCustomerForm state={state} Inputchange={Inputchange} />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              //   style={{ float: "right" }}
              //   sx={{ mb: 4 }}
              disabled={disabled}
              variant="contained"
            >
              Update
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Fragment>
  );
}
