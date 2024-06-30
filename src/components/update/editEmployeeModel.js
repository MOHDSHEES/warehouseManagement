import React, { Fragment, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddEmployeeForm from "../employee/addEmployeeForm";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { closeMessage, openMessage } from "../functions/message";
import { MyContext } from "../context";

export default function EditEmployeeModel({
  open,
  setOpen,
  employeeData,
  setEmployeeData,
  employees,
  setEmployees,
  filterFunction,
  templates,
  setTemplates,
}) {
  const handleClose = () => {
    setEmployeeData("");
    setOpen(false);
  };
  const { messageApi, user } = useContext(MyContext);
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // const [templates, setTemplates] = useState("");
  const [warehousesSelected, setWarehousesSelected] = useState(["loading..."]);
  const [error, setError] = useState(false);
  const [warehouses, setWarehouses] = useState("");
  const [privilegesTemplate, setPrivilegesTemplate] = useState("");
  const privilegesOptions = {
    Add_Employee: false,
    Add_Warehouse: false,
    Edit_Warehouse: false,
    Add_Shelf: false,
    Delete_Shelf: false,
    Add_Product_To_Shelf: false,
    Out_Of_Stock: false,
    Register_Product: false,
    Update_Product: false,
  };
  const [privileges, setPrivileges] = useState(privilegesOptions);
  const [state, setstate] = useState({
    email: employeeData.email,
    joiningDate: "",
    post: "",
    jobType: "",
  });
  useEffect(() => {
    setstate({
      email: employeeData.email,
      joiningDate: employeeData.joiningDate,
      post: employeeData.post,
      jobType: employeeData.jobType,
    });
    if (employeeData && employeeData.privilegesTemplate) {
      setPrivilegesTemplate(employeeData.privilegesTemplate.name);
      // const privileges = user.company.privilegesTemplate.filter(
      //   (template) => template.name === employeeData.privilegesTemplate
      // );
      // console.log(privileges);

      setPrivileges(employeeData.privilegesTemplate.roles);
    }
  }, [employeeData, user]);
  useEffect(() => {
    if (
      employeeData &&
      warehouses &&
      warehouses.length > 0 &&
      employeeData.warehouse.length > 0
    ) {
      const data = employeeData.warehouse.map((data) => data.warehouseName);
      setWarehousesSelected(data);
    }
  }, [employeeData, warehouses]);
  // useEffect(() => {
  //   if (employeeData && templates && templates.length > 0) {
  //     setPrivilegesTemplate(employeeData.privilegesTemplate);
  //     setPrivileges(employeeData.privileges);
  //   }
  // }, [employeeData, templates]);

  // useEffect(() => {
  //   if (privilegesTemplate === "") setPrivileges(privilegesOptions);
  //   else if (templates) {
  //     const data = templates.filter(
  //       (template) => template.name === privilegesTemplate
  //     );
  //     if (data && data.length) setPrivileges(data[0].roles);
  //   }
  // }, [privilegesTemplate, templates]);

  // console.log(privilegesTemplate);
  //   console.log(role);
  const handleChange = (event) => {
    setPrivileges({
      ...privileges,
      [event.target.name]: event.target.checked,
    });
  };

  // function clear() {
  //   setPrivilegesTemplate("");
  //   setstate({
  //     email: "",
  //     joiningDate: "",
  //     post: "",
  //     jobType: "",
  //   });
  // }
  // console.log(state);
  const Inputchange = (event) => {
    setValidated(false);
    const { name, value } = event.target;
    setstate({
      ...state,
      [name]: value,
    });
  };

  async function submitHandler(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      if (user) {
        setDisabled(true);
        openMessage(messageApi, "Updating...");
        const filteredWarehouseIds = warehouses
          .filter((warehouse) =>
            warehousesSelected.includes(warehouse.warehouseName)
          )
          .map((warehouse) => warehouse._id);
        const newPrivileges = templates.filter(
          (privilege) => privilege.name === privilegesTemplate
        );
        // console.log(newPrivileges);
        const { data } = await axios.post("/api/employee/update", {
          _id: employeeData._id,
          company: user && user.company._id,
          details: {
            joiningDate: state.joiningDate,
            post: state.post,
            jobType: state.jobType,
            warehouse: filteredWarehouseIds,
            privilegesTemplate: newPrivileges[0]._id,
          },
        });
        // console.log(data);
        //   console.log(state);
        if (data.status === 200) {
          closeMessage(messageApi, data.message, "success");
          setValidated(false);
          const updatedEmployee = employees.map((employee) =>
            employee._id === data.data._id ? data.data : employee
          );
          setEmployees(updatedEmployee);
          filterFunction({ name: "all" });
          handleClose();
          // clear();
        } else {
          closeMessage(messageApi, data.message, "error");
          setValidated(true);
        }
        setDisabled(false);
      }
    }
  }
  // async function getPrivelegeTemplate() {
  //   const { data } = await axios.post("/api/user/privilegeTemplate/get", {
  //     company: user.company && user.company._id,
  //   });
  //   setTemplates(data.data);
  // }
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
        setError(true);
        setWarehousesSelected(["No warehouses found."]);
        setWarehouses([]);
      }
    }
  }, [user, warehouses]);

  function onPrivilegesChange(value) {
    setPrivilegesTemplate(value);
    const data = templates.filter((template) => template.name === value);
    if (data && data.length) setPrivileges(data[0].roles);
  }

  // useEffect(() => {
  //   if (user && templates === "") getPrivelegeTemplate();
  // }, [user]);

  return (
    <Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        maxWidth="lg"
        // onClose={handleClose}
      >
        <DialogTitle>Edit:</DialogTitle>

        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

          <Form validated={validated} onSubmit={submitHandler}>
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
              handleChange={handleChange}
              templates={templates}
              component="Update"
              onPrivilegesChange={onPrivilegesChange}
            />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              disabled={disabled}
              onClick={submitHandler}
              type="submit"
            >
              Update
            </Button>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
