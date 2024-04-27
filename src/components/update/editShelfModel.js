import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { signOut } from "next-auth/react";
import axios from "axios";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";
import { updateShelfName } from "../functions/recursiveFunctions/updateRecursive";

export default function EditShelf({
  setEditShelf,
  editShelf,
  shelfClicked,
  setShelves,
  shelves,
  setEditModelOpen,
}) {
  //   console.log(shelfClicked);
  const [shelfName, setShelfName] = React.useState(
    shelfClicked && shelfClicked.shelfName ? shelfClicked.shelfName : ""
  );
  React.useEffect(() => {
    if (shelfClicked && shelfClicked.shelfName)
      setShelfName(shelfClicked.shelfName);
  }, [shelfClicked]);
  const [disable, setdisable] = React.useState(false);
  const { user, messageApi } = React.useContext(MyContext);
  function handleClose() {
    setShelfName("");
    setEditShelf(false);
  }
  //   console.log(shelfClicked);
  async function handleSubmit(e) {
    e.preventDefault();
    setdisable(true);
    openMessage(messageApi, "Updating Shelf...");
    // console.log([...shelfClicked.shelfPath.slice(0, -1), shelfName]);

    const isNameConflict = shelves.filter(
      (obj1) =>
        obj1.parentShelf === shelfClicked.parentShelf &&
        obj1.shelfName === shelfName
    );

    if (isNameConflict && isNameConflict.length > 0)
      closeMessage(messageApi, "Shelf Name Conflict.", "error");
    else {
      if (user && user._id) {
        const { data } = await axios.post("/api/shelf/update", {
          detail: {
            shelfName: shelfName,
            shelfPath: [...shelfClicked.shelfPath.slice(0, -1), shelfName],
          },
          shelfData: shelfClicked,
        });
        if (data && data.status === 200) {
          const updatedShelves = updateShelfName(shelves, data.data._id, {
            shelfName: data.data.shelfName,
            shelfPath: data.data.shelfPath,
          });
          // console.log(updatedShelves);
          setShelves(updatedShelves);
          setEditModelOpen(false);
          handleClose();
          closeMessage(messageApi, "Shelf updated successfully", "success");
        } else closeMessage(messageApi, data.msg, "error");
      } else {
        handleClose();
        signOut();
      }
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
        open={editShelf}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            handleSubmit(event);
          },
        }}
      >
        <DialogTitle>Update Sub-Shelf</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kindly provide the updated name or ID for the shelf.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            autoComplete="off"
            id="name"
            value={shelfName}
            onChange={(e) => setShelfName(e.target.value.toUpperCase())}
            name="subShelf"
            label="Shelf Name or Id"
            fullWidth
            variant="standard"
          />
          {/* <DialogContentText className="mt-3">
            <b>Note</b> Existing products located on the current shelf will be
            transferred to the new subShelf automatically.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button disabled={disable} onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disable}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
