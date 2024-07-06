import React, { useContext } from "react";
import { FormHelperText, Stack } from "@mui/material";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Row } from "react-bootstrap";

const AddCustomerForm = ({ state, Inputchange }) => {
  return (
    <Stack spacing={3}>
      <Row>
        <Form.Group as={Col} md="6" className="mb-3" controlId="name">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={state.name}
            onChange={Inputchange}
            placeholder="Enter Customer, Shop or Company Name"
            required
          />
          <Form.Control.Feedback type="invalid">
            Enter Customer, Shop or Company Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={state.email}
            onChange={Inputchange}
            placeholder="Enter Email"
            // required
          />
          <Form.Control.Feedback type="invalid">
            Enter Valid Email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3" controlId="customerType">
          <Form.Label>Customer Type *</Form.Label>
          <Form.Select
            required
            name="customerType"
            value={state.customerType}
            onChange={Inputchange}
          >
            <option value="">Choose...</option>
            {/* <option value="Intern">Intern</option> */}
            <option value="Company">Company</option>
            <option value="Shop">Shop</option>
            <option value="Individual">Individual</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Select a valid Customer Type.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3" controlId="mobileNo">
          <Form.Label>Mobile/Phone No.</Form.Label>
          <Form.Control
            type="tel"
            name="mobileNo"
            value={state.mobileNo}
            onChange={Inputchange}
            placeholder="Enter Phone No."
          />
          <Form.Control.Feedback type="invalid">
            Please Enter Phone No.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="12" className="mb-3" controlId="address">
          <Form.Label>Address*</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={state.address}
            onChange={Inputchange}
            placeholder="Enter complete address"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please Enter complete address.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
    </Stack>
  );
};

export default AddCustomerForm;
