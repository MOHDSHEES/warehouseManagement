import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import OrderProductsTable from "./orderProductsTable";
import { Alert, Box, CircularProgress } from "@mui/material";
import { closeMessage } from "@/src/components/functions/message";
// import { useRouter } from "next/router";

export default function SelectReturnFromOrder({
  open,
  setOpen,
  data,
  orderLoading,
  value,
  setValue,
  messageApi,
}) {
  const [itemSelectedFromOrder, setItemSelectedFromOrder] = useState(null);

  function addReturnProduct(data) {
    const itemToUpdate = value.find(
      (item) =>
        item.orderId === data.orderId &&
        item.item._id === data.item._id &&
        item.item.orderData.shelf.color === data.item.orderData.shelf.color
    );
    // console.log(itemToUpdate);
    if (itemToUpdate && itemToUpdate.orderId) {
      closeMessage(messageApi, "Item Already added.");
    } else setValue([...value, data]);
    // console.log(data);
    // console.log(value);
    setOpen(false);
  }
  // console.log(value);
  // const {
  //   user,
  //   messageApi,
  //   setUser,
  //   setPrivileges,
  //   isAdmin,
  //   privilegeOptions,
  // } = useContext(MyContext);
  // console.log(data);

  const handleClose = () => {
    setItemSelectedFromOrder(null);
    setOpen(false);
  };
  // console.log(data);
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
        <DialogTitle>Past Orders:</DialogTitle>

        <DialogContent>
          {orderLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                width: "300px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : data ? (
            <OrderProductsTable
              data={data}
              itemSelectedFromOrder={itemSelectedFromOrder}
              setItemSelectedFromOrder={setItemSelectedFromOrder}
              addReturnProduct={addReturnProduct}
            />
          ) : (
            <Alert icon={false} severity="info">
              No previous orders found for the selected item.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
