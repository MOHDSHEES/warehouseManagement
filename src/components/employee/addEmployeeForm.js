import React, { useContext } from "react";
import { FormHelperText, Stack } from "@mui/material";
import Form from "react-bootstrap/Form";
import { MyContext } from "../context";
import Col from "react-bootstrap/Col";
import { Row } from "react-bootstrap";
import Privilages from "./privilages/privileges";
import MultipleSelect from "../UI-component/multipleSelect";

const AddEmployeeForm = ({
  state,
  Inputchange,
  error,
  setError,
  warehousesSelected,
  setWarehousesSelected,
  warehouses,
  privilegesTemplate,
  // setPrivilegesTemplate,
  privileges,
  handleChange,
  templates,
  component,
  onPrivilegesChange,
}) => {
  const { user } = useContext(MyContext);
  return (
    <Stack spacing={3}>
      {/* <Form noValidate validated={validated} onSubmit={submitHandler}> */}
      <Row>
        {/* <Form.Group
            className="mb-3"
            as={Col}
            md="4"
            controlId="validationCustom01"
          > */}
        <Form.Group
          as={Col}
          md="6"
          className="mb-3"
          controlId="formGridAddress2"
        >
          <Form.Label>Email *</Form.Label>
          <Form.Control
            type="email"
            name="email"
            disabled={component === "Update" && true}
            value={state.email}
            onChange={Inputchange}
            placeholder="Enter Email"
            required
          />
          <Form.Control.Feedback type="invalid">
            Enter Valid Email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="6"
          className="mb-3"
          controlId="formGridJobType"
        >
          <Form.Label>Job Type</Form.Label>
          <Form.Select
            required
            name="jobType"
            value={state.jobType}
            onChange={Inputchange}
          >
            <option value="">Choose...</option>
            {/* <option value="Intern">Intern</option> */}
            <option value="Permanent Employee">Permanent Employee</option>
            <option value="Part time Employee">Part time Employee</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Select a valid Job Type.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="6"
          className="mb-3"
          controlId="formGridAddress2"
        >
          <Form.Label>Enter the Post of Employee *</Form.Label>
          <Form.Control
            type="text"
            name="post"
            value={state.post}
            onChange={Inputchange}
            placeholder="Enter Post"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please Enter post.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Col}
          md="6"
          className="mb-3"
          controlId="formGridJoiningDate"
        >
          <Form.Label>Select the Joining Date of Employee/Intern *</Form.Label>
          <Form.Control
            type="date"
            name="joiningDate"
            value={state.joiningDate}
            onChange={Inputchange}
            placeholder="select joining date"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please choose Joining Date.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3" controlId="formGridRole">
          <Form.Label>Warehouse:</Form.Label>
          <MultipleSelect
            error={error}
            setError={setError}
            value={warehousesSelected}
            setValue={setWarehousesSelected}
            options={warehouses}
          />
          {!error && (
            <FormHelperText>
              Please choose one or more warehouses
            </FormHelperText>
          )}
        </Form.Group>
        <Form.Group as={Col} md="6" className="mb-3" controlId="formGridRole">
          <Form.Label>Privileges</Form.Label>
          <Form.Select
            name="privileges"
            required
            value={privilegesTemplate}
            // onChange={(e) => setPrivilegesTemplate(e.target.value)}
            onChange={(e) => onPrivilegesChange(e.target.value)}
          >
            <option value="">Choose Template...</option>
            {templates === "" ? (
              <option value="">Loading Templates...</option>
            ) : templates && templates.length > 0 ? (
              templates.map((template, idx) => (
                <option key={idx} value={template.name}>
                  {template.name}
                </option>
              ))
            ) : (
              <option value="">No Template Found. Try Adding Some...</option>
            )}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Select privelege Template.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      {privilegesTemplate !== "" && (
        <Privilages
          state={privileges}
          handleChange={handleChange}
          options={
            user && user.company ? user.company.warehouse : user.warehouse
          }
        />
      )}
      {/* {(privilegesTemplate !== "" ||
          (privilegesTemplate === "" &&
            templates !== "" &&
            templates.length === 0)) && (
          <Privilages state={privileges} handleChange={handleChange} />
        )} */}
    </Stack>
  );
};

export default AddEmployeeForm;
