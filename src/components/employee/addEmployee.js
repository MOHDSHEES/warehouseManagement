import { useContext, useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, Divider } from "@mui/material";
import Form from "react-bootstrap/Form";
import { MyContext } from "../context";
import axios from "axios";
import { closeMessage, openMessage } from "../functions/message";
import AddEmployeeForm from "./addEmployeeForm";

export const AddEmployee = () => {
  const { messageApi, user, privilegeOptions } = useContext(MyContext);
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [templates, setTemplates] = useState("");
  const [warehousesSelected, setWarehousesSelected] = useState(["loading..."]);
  const [error, setError] = useState(false);
  const [warehouses, setWarehouses] = useState("");

  const [privileges, setPrivileges] = useState(privilegeOptions);
  const [state, setstate] = useState({
    email: "",
    joiningDate: "",
    post: "",
    jobType: "",
    status: 1,
  });
  const [privilegesTemplate, setPrivilegesTemplate] = useState("");
  //   console.log(role);
  // const handleChange = (event) => {
  //   setPrivileges({
  //     ...privileges,
  //     [event.target.name]: event.target.checked,
  //   });
  // };
  useEffect(() => {
    if (privilegesTemplate === "") setPrivileges(privilegeOptions);
    else {
      const data = templates.filter(
        (template) => template.name === privilegesTemplate
      );
      if (data && data.length) setPrivileges(data[0].roles);
    }
  }, [privilegesTemplate]);
  function clear() {
    setPrivilegesTemplate("");
    setstate({
      email: "",
      joiningDate: "",
      post: "",
      jobType: "",
      status: 1,
    });
  }
  const Inputchange = (event) => {
    setValidated(false);
    const { name, value } = event.target;
    if (name === "email") {
      setstate({
        ...state,
        [name]: value.toLowerCase().trim(),
      });
    } else
      setstate({
        ...state,
        [name]: value,
      });
  };

  async function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (warehouses && warehouses.length === 0) setError(true);
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      if (warehouses && warehouses.length === 0) {
        setError(true);
      } else if (user) {
        setDisabled(true);
        openMessage(messageApi, "Sending...");
        const filteredWarehouseIds = warehouses
          .filter((warehouse) =>
            warehousesSelected.includes(warehouse.warehouseName)
          )
          .map((warehouse) => warehouse._id);
        const privilegesId = templates.filter(
          (privilege) => privilege.name === privilegesTemplate
        );
        const { data } = await axios.post("/api/employee/emailRegister", {
          state: state,
          warehouse: filteredWarehouseIds,
          privilegesTemplate: privilegesId[0],
          // privileges: privileges,
          company: user && user.company._id,
        });
        //   console.log(data);
        //   console.log(state);
        if (data.success) {
          closeMessage(messageApi, data.message, "success");
          setValidated(false);
          clear();
        } else {
          closeMessage(messageApi, data.message, "error");
          setValidated(true);
          // setisValid(false);
        }
        // console.log(data);
        setDisabled(false);
      }
    }
  }
  async function getPrivelegeTemplate() {
    const { data } = await axios.post("/api/user/privilegeTemplate/get", {
      company: user.company && user.company._id,
    });
    setTemplates(data.data);
  }
  function onPrivilegesChange(value) {
    setPrivilegesTemplate(value);
  }
  async function getWarehouses() {
    warehouseFlag = 0;
    const { data } = await axios.post("/api/warehouse/getDetails", {
      ids: user.company.warehouses,
    });
    if (data.status === 200) {
      setWarehouses(data.data);
      setWarehousesSelected([data.data[0].warehouseName]);
    }
  }
  let warehouseFlag = 1;
  useEffect(() => {
    if (user && user.company.warehouses && !warehouses && warehouseFlag) {
      if (user.company.warehouses.length > 0) getWarehouses();
      else {
        // setError(true);
        setWarehousesSelected(["No warehouses found."]);
        setWarehouses([]);
      }
    }
  }, [user, warehouses]);

  useEffect(() => {
    if (user && templates === "") getPrivelegeTemplate();
  }, [user]);
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
          <AddEmployeeForm
            state={state}
            Inputchange={Inputchange}
            error={error}
            setError={setError}
            warehousesSelected={warehousesSelected}
            setWarehousesSelected={setWarehousesSelected}
            warehouses={warehouses}
            privilegesTemplate={privilegesTemplate}
            setPrivilegesTemplate={setPrivilegesTemplate}
            privileges={privileges}
            // handleChange={handleChange}
            templates={templates}
            onPrivilegesChange={onPrivilegesChange}
          />
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button disabled={disabled} variant="contained" type="submit">
            Send Email
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
};
