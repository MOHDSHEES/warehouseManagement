import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InvoiceTemplate from "../selectProducts/invoiceTemplate";

export default function OrderDetailsModel({
  open,
  setOpen,
  selectedOrder,
  setSelectedOrder,
}) {
  //   const [open, setOpen] = useState(false);
  //   console.log(selectedOrder);
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder("");
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth={true}
        // PaperProps={{
        //   component: "form",
        //   onSubmit: (event) => {
        //     event.preventDefault();
        //     const formData = new FormData(event.currentTarget);
        //     const formJson = Object.fromEntries(formData.entries());
        //     const email = formJson.email;
        //     console.log(email);
        //     handleClose();
        //   },
        // }}
      >
        <DialogTitle>Order: #{selectedOrder.orderId}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Created By:{" "}
            {selectedOrder &&
              selectedOrder.placedBy &&
              selectedOrder.placedBy.name}
          </DialogContentText>
          {selectedOrder && <InvoiceTemplate invoiceData={selectedOrder} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {/* <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
