import { Fragment, useContext, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert, FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { closeMessage } from "../../functions/message";
import { MyContext } from "../../context";
import BackdropComponent from "../../UI-component/backdrop";
import { signOut, useSession } from "next-auth/react";

const updateArray = (arr, updatedObj, shelfClicked) => {
  if (!updatedObj) {
    return arr.filter((item) => item._id !== shelfClicked._id);
  }
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

export default function DeleteShelfModel({
  openDelete: open,
  setOpenDelete: setOpen,
  shelfClicked,
  shelves,
  setShelves,
  handleClose: handleCloseEditModel,
}) {
  const [shelfName, setShelfName] = useState("");
  const { status } = useSession();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [method, setMethod] = useState("");
  const [error, setError] = useState(false);
  //   const [shelfNameError, setShelfNameError] = useState("");
  const { messageApi } = useContext(MyContext);

  //   console.log(shelves);
  //   const [open, setOpen] = React.useState(false);
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  function inputChange(e) {
    setError(false);
    setShelfName(e.target.value.toUpperCase());
  }
  function clear() {
    setMethod("");
    setError(false);
    setShelfName("");
  }

  const handleClose = () => {
    clear();
    setOpen(false);
  };
  const menuItem = [
    // { opt: "Remove current Shelf (with products)", value: "CP" },
    { opt: "Remove current Shelf (without products)", value: "CNP" },
    // {
    //   opt: "Remove current Shelf and all of its sub shelves (without products)",
    //   value: "ANP",
    // },
  ];

  async function submitHandler() {
    if (status === "authenticated") {
      if (shelfName === shelfClicked.shelfName) {
        if (
          method !== "" &&
          window.confirm(
            "Are you sure you want to delete the shelf? This action cannot be undone.\n\nPress OK to delete."
          )
        ) {
          setOpenBackdrop(true);
          const { data } = await axios.post("/api/shelf/delete", {
            method: method,
            shelf: shelfClicked,
          });
          // console.log(data);
          if (data.status === 200) {
            closeMessage(messageApi, data.msg, "success");
            setShelves(updateArray(shelves, data.data, shelfClicked));
            handleClose();
            handleCloseEditModel();
          } else if (data.status === 202) {
            closeMessage(messageApi, data.msg, "error", 4);
          }
        }
        setOpenBackdrop(false);
      } else setError(true);
    } else {
      closeMessage(messageApi, "Token expired.", "error");
      signOut();
    }
  }

  return (
    <Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            submitHandler();
            // handleClose();
          },
        }}
      >
        <DialogTitle>
          Delete Shelf: {shelfClicked && shelfClicked.shelfName}
        </DialogTitle>

        <Alert severity="warning">
          Deleting the shelf is Irreversible.
          {/* <br />
          All sub-shelves and data will be permanently removed. */}
        </Alert>

        <DialogContent>
          <small>
            <b>Note: </b>To know more about Deletion Methods, please refer to
            the Instructions Guide.
          </small>
          <FormControl sx={{ width: "100%", mt: 3 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Method of Deletion
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={method}
              required
              onChange={(e) => setMethod(e.target.value)}
              label="Method of Deletion"
            >
              {shelfClicked &&
                shelfClicked.parentShelf &&
                menuItem.map((item, idx) => (
                  <MenuItem key={idx} value={item.value}>
                    {item.opt}
                  </MenuItem>
                ))}
              {shelfClicked &&
              shelfClicked.childrenShelves &&
              shelfClicked.childrenShelves.length === 0 &&
              shelfClicked.parentShelf ? (
                <MenuItem value={"CP"}>
                  Remove current Shelf (with products)
                </MenuItem>
              ) : (
                <MenuItem value={"AP"}>
                  Remove current Shelf and all of its sub shelves (with
                  products)
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <small>Select the Method of deletion.</small>

          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

          <TextField
            autoFocus
            required
            sx={{ mt: 3 }}
            margin="dense"
            id="name"
            name="email"
            label="Enter Shelf Name"
            value={shelfName}
            onChange={inputChange}
            // type="email"
            autoComplete="off"
            error={error}
            fullWidth
            // variant="standard"
          />
          {error && (
            <FormHelperText style={{ color: "red" }} id="component-error-text">
              Shelf Name Mismatched
            </FormHelperText>
          )}
          <small className="mt-3">
            Enter
            <b> &quot;{shelfClicked && shelfClicked.shelfName}&quot; </b>
            in the input field to proceed with the deletion.
          </small>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" type="submit">
            Submit
          </Button>
          <Button onClick={handleClose} variant="contained" color="success">
            Cancel
          </Button>
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>
      <BackdropComponent open={openBackdrop} />
    </Fragment>
  );
}
