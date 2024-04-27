import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MyContext } from "../../context";
import { closeMessage, openMessage } from "../../functions/message";
import { signOut } from "next-auth/react";
import axios from "axios";

const updateArray = (arr, updatedObj) => {
  return arr.map((item) => {
    if (item._id === updatedObj._id) {
      return updatedObj;
    } else if (item.childrenShelvesData) {
      item.childrenShelvesData = updateArray(
        item.childrenShelvesData,
        updatedObj
      );
    }
    return item;
  });
};
export default function AddSubShelf({
  handleClose: closeModel,
  open,
  shelfClicked,
  warehouseId,
  setShelves,
  shelves,
  setEditModelOpen,
}) {
  const [shelfName, setShelfName] = React.useState("");
  const [disable, setdisable] = React.useState(false);
  const { user, messageApi } = React.useContext(MyContext);
  function handleClose() {
    setShelfName("");
    closeModel();
  }
  //   console.log(shelfClicked);
  async function handleSubmit(e) {
    e.preventDefault();
    setdisable(true);
    openMessage(messageApi, "Adding Sub-Shelf...");
    if (user && user._id) {
      const { data } = await axios.post("/api/shelf/add", {
        detail: {
          shelfName: shelfName,
          warehouse: warehouseId,
          parentShelf: shelfClicked._id,
          rootShelf: shelfClicked.rootShelf
            ? shelfClicked.rootShelf
            : shelfClicked._id,
          shelfPath: [...shelfClicked.shelfPath, shelfName],
        },
      });
      if (data && data.status === 200) {
        setShelves(updateArray(shelves, data.data));
        setEditModelOpen(false);
        handleClose();
        closeMessage(messageApi, "Sub Shelf Sucessfully added", "success");
      } else if (
        data &&
        data.status === 500 &&
        data.msg.split(" ")[0] === "E11000"
      )
        closeMessage(
          messageApi,
          "Shelf already registered with this name.",
          "error"
        );
    } else {
      handleClose();
      signOut();
    }
    setdisable(false);
    // handleClose();
  }
  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            handleSubmit(event);
          },
        }}
      >
        <DialogTitle>Add Sub-Shelf</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the name or ID of the sub-shelf you&apos;d like to
            add to the shelf: <b>{shelfClicked?.shelfName}</b>
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            value={shelfName}
            onChange={(e) => setShelfName(e.target.value.toUpperCase())}
            name="subShelf"
            label="Sub Shelf Name or Id"
            fullWidth
            variant="standard"
          />
          <DialogContentText className="mt-3">
            <b>Note</b> Existing products located on the current shelf will be
            transferred to the new subShelf automatically.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={disable} onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disable}>
            Add SubShelf
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
