import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import NumberInput from "@/src/components/functions/numberInput";
import { closeMessage } from "@/src/components/functions/message";
import { MyContext } from "@/src/components/context";

export default function ReturnQtyModel({
  open,
  setOpen,
  itemSelectedFromOrder,
  setItemSelectedFromOrder,
  addReturnProduct,
}) {
  const [qty, setQty] = React.useState(1);

  //   console.log(itemSelectedFromOrder);
  const { messageApi } = React.useContext(MyContext);
  const [comment, setComment] = React.useState("");
  const [maxQty, setmaxQty] = React.useState(
    itemSelectedFromOrder
      ? parseInt(
          itemSelectedFromOrder.item[0].orderData.qty -
            (itemSelectedFromOrder.item[0].return
              ? itemSelectedFromOrder.item[0].return.quantity
              : 0)
        )
      : 1
  );
  React.useEffect(() => {
    if (itemSelectedFromOrder) {
      setmaxQty(
        parseInt(
          itemSelectedFromOrder.item[0].orderData.qty -
            (itemSelectedFromOrder.item[0].return
              ? itemSelectedFromOrder.item[0].return.quantity
              : 0)
        )
      );
    }
  }, [itemSelectedFromOrder]);
  //   console.log(itemSelectedFromOrder);

  const handleClose = () => {
    setItemSelectedFromOrder(null);
    setmaxQty(1);
    setQty(1);
    setComment("");
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            if (maxQty < 1)
              closeMessage(
                messageApi,
                "All items have already been returned.",
                "error"
              );
            else if (parseInt(qty) < 1)
              closeMessage(messageApi, "Qty can not be 0", "error");
            else {
              addReturnProduct({
                ...itemSelectedFromOrder,
                item: itemSelectedFromOrder.item[0],
                returnQty: parseInt(qty),
                comment: comment.trim(),
              });
              setOpen(false);
            }

            //   const formData = new FormData(event.currentTarget);
            //   const formJson = Object.fromEntries(formData.entries());
            //   const email = formJson.email;
            //   console.log(email);
            //   handleClose();
          },
        }}
      >
        <DialogTitle>Quantity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the quantity to be returned. (max: {maxQty})
          </DialogContentText>
          <NumberInput
            autoFocus
            sx={{ mt: 2 }}
            aria-label="Return Qty Input"
            placeholder="Enter return Qty"
            required
            min={1}
            max={maxQty}
            value={qty}
            onChange={(event, val) => setQty(val)}
          />
          <TextField
            // autoFocus
            sx={{ mt: 2 }}
            margin="dense"
            id="comment"
            name="comment"
            multiline
            maxRows={4}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            label="Additional Comment"
            type="text"
            fullWidth
            // variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
