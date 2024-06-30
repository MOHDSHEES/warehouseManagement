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

export default function EditReturnProduct({
  open,
  setOpen,
  itemSelectedFromOrder,
  setItemSelectedFromOrder,
  rowIdx,
  value,
  setValue,
  setOpenMenu,
}) {
  const [idx, setIdx] = React.useState(rowIdx);
  const { messageApi } = React.useContext(MyContext);
  const [qty, setQty] = React.useState(itemSelectedFromOrder.returnQty);
  const [comment, setComment] = React.useState(itemSelectedFromOrder.comment);
  const [maxQty, setmaxQty] = React.useState(
    itemSelectedFromOrder
      ? parseInt(itemSelectedFromOrder.item.orderData.qty)
      : 1
  );
  React.useEffect(() => {
    if (itemSelectedFromOrder) {
      setmaxQty(parseInt(itemSelectedFromOrder.item.orderData.qty));
      setQty(itemSelectedFromOrder.returnQty);
      setComment(itemSelectedFromOrder.comment);
      setIdx(rowIdx);
    }
  }, [itemSelectedFromOrder]);
  //   console.log(itemSelectedFromOrder);

  const handleClose = () => {
    setItemSelectedFromOrder({ data: "", idx: "" });
    setmaxQty(1);
    setQty(1);
    setComment("");
    setOpen(false);
    setOpenMenu(false);
  };

  function updateData() {
    const updatedValue = [...value]; // Creating a copy of the original array
    updatedValue[idx] = {
      ...value[idx],
      returnQty: parseInt(qty),
      comment: comment.trim(),
    };
    // console.log(updatedValue);
    setValue(updatedValue);
    closeMessage(messageApi, "updated Successfully", "success");
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            updateData();
            // addReturnProduct({
            //   ...itemSelectedFromOrder,
            //   item: itemSelectedFromOrder.item[0],
            //   returnQty: parseInt(qty),
            //   comment: comment.trim(),
            // });
            // setOpen(false);
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
