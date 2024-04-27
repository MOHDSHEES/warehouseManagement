import React, { Fragment, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Container, Grid, TextField } from "@mui/material";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";
import axios from "axios";

export default function UpdateWarehouseDetails({
  setOpenWarehouse,
  openWarehouse,
  warehouseClicked,
  handleEditWarehouseModel,
}) {
  const [disable, setdisable] = useState(false);
  useEffect(() => {
    setstate({
      warehouseName: warehouseClicked.warehouseName,
      address: warehouseClicked.address,
    });
  }, [warehouseClicked]);
  const handleClose = () => {
    setOpenWarehouse(false);
  };
  const { user, messageApi, warehouses, setWarehouses } = useContext(MyContext);
  const [state, setstate] = useState({
    warehouseName: warehouseClicked.warehouseName,
    address: warehouseClicked.address,
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
    const isDuplicateName = warehouses.filter(
      (warehouse) =>
        warehouse._id !== warehouseClicked._id &&
        warehouse.warehouseName === state.warehouseName
    );
    if (isDuplicateName.length)
      closeMessage(messageApi, "Warehouse Name already Exsist.", "error");
    else {
      openMessage(messageApi, "Updating warehouse...");
      if (user && user._id) {
        const { data } = await axios.post("/api/warehouse/update", {
          detail: state,
          companyId: user.company._id,
          warehouseId: warehouseClicked._id,
        });
        if (data && data.status === 200) {
          const updatedWarehouses = warehouses.map((warehouse) => {
            if (warehouse._id === data.data._id) {
              return data.data;
            }
            return warehouse;
          });
          setWarehouses(updatedWarehouses);
          handleClose();
          handleEditWarehouseModel();
          closeMessage(messageApi, "Warehouse Sucessfully updated", "success");
        } else {
          closeMessage(messageApi, data.msg, "error");
        }
      } else signOut();
    }
    setdisable(false);
  }

  return (
    <Fragment>
      <Dialog
        open={openWarehouse}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update Warehouse details"}
        </DialogTitle>
        <DialogContent>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                // marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <fieldset disabled={disable}>
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
                    //   fullWidth
                    disabled={disable}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ mt: 3, mb: 2, marginLeft: 2 }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Box>
              </fieldset>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
