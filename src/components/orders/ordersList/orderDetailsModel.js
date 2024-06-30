import React, { useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InvoiceTemplate from "../selectProducts/invoiceTemplate";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, Stack, Typography } from "@mui/material";
import { MyContext } from "../../context";
import generateInvoiceDocument, {
  downloadInvoice,
} from "../../functions/generateInvoice";

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

  const { user } = useContext(MyContext);
  const handleDownload = () => {
    const doc = generateInvoiceDocument(
      selectedOrder,
      user.company.companyName
    );
    downloadInvoice(doc, `Invoice(${selectedOrder.orderId}).pdf`);
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
        <DialogTitle>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">
              Order Id: {selectedOrder.orderId}
            </Typography>
            <span style={{ marginLeft: "auto" }}>
              <IconButton
                onClick={handleDownload}
                aria-label="Invoice Download"
              >
                <DownloadIcon />
              </IconButton>
            </span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2">
              Created By:{" "}
              {selectedOrder &&
                selectedOrder.placedBy &&
                selectedOrder.placedBy.name}
            </Typography>
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
