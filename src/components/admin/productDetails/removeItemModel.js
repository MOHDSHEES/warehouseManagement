import React, { useContext, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Unstable_Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { closeMessage, openMessage } from "../../functions/message";
import { MyContext } from "../../context";
import axios from "axios";

export default function RemoveItemModel({
  open,
  setOpen,
  selectedRow,
  // setSelectedRow,
  warehouseId,
  // setShelfProducts,
  // shelfProducts,
  updateProducts,
}) {
  const [qty, setQty] = useState(1);
  const [isRequired, setIsRequired] = useState(false);
  const [disabledQty, setDisabledQty] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { messageApi } = useContext(MyContext);
  const handleClose = (value) => {
    setOpen(false);
    // setSelectedValue(value);
  };
  // console.log(selectedRow);
  const handleCheckboxChange = (event) => {
    event.target.checked ? setDisabledQty(true) : setDisabledQty(false);
    setIsRequired(event.target.checked);
  };
  async function removeHandler(e) {
    const isRequire = isRequired || qty >= selectedRow.quantity;
    // console.log(isRequire);
    e.preventDefault();
    if (!isRequire && (!Number(qty) || !qty))
      closeMessage(messageApi, "Invalid Qty", "error");
    else {
      const shouldDelete = window.confirm(
        "Are you sure you want to Remove the Stock?"
      );
      if (shouldDelete) {
        setDisabled(true);
        openMessage(messageApi, "Removing...");
        const { data } = await axios.post("/api/product/removeFromShelf", {
          data: selectedRow,
          qty: qty,
          isRequired: isRequire,
          warehouse: warehouseId,
        });
        if (data.status === 200) {
          closeMessage(messageApi, "Updated Successfully", "success");
          // let updatedData;
          // if (!isRequire) {
          //   updatedData = shelfProducts.map((da) => {
          //     if (da._id === data.data._id) return data.data;
          //     else return da;
          //   });
          // } else {
          //   updatedData = shelfProducts.filter((da) => {
          //     if (da._id !== data.data._id) return da;
          //   });
          // }
          // console.log(updatedData);
          // setShelfProducts(updatedData);
          setOpen(false);
          setDisabled(false);
          updateProducts();
        } else if (data.msg) closeMessage(messageApi, data.msg, "error");
        setDisabled(false);
      }
    }
  }

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Remove Item:</DialogTitle>
        <DialogContent>
          <Typography variant="caption">
            Enter the quantity to be removed from the shelf, or select the
            checkbox to clear all stock.
          </Typography>

          <Grid item xs={12} md={6} lg={6}>
            {/* <Card sx={{ p: 2 }}> */}
            <fieldset disabled={disabled}>
              <form onSubmit={removeHandler}>
                <Stack style={{ marginTop: "25px" }} spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    id="qty"
                    label="Quantity"
                    variant="outlined"
                    disabled={disabledQty}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    autoComplete="off"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={isRequired}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Remove full Stock"
                  />
                  <Button type="submit" variant="contained">
                    {disabled ? "Removing" : "Remove"}
                  </Button>
                </Stack>
              </form>
            </fieldset>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
