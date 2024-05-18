import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import TableTop from "./productDetailsTable/tableTop";
import ProductShelfTable from "./productDetailsTable/productShelfTable";
import EditIcon from "@mui/icons-material/Edit";
import EditProductModel from "../../update/editProductModel";
import { MyContext } from "../../context";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";

export default function ProductDetails({
  openProductDetails,
  setOpenProductDetails,
  searchedData,
  setSearchedData,
  warehouse,
}) {
  const [openEditModel, setOpenEditModel] = React.useState(false);
  const { shelves = null } = searchedData || {};
  const { privileges, isAdmin } = React.useContext(MyContext);
  const [disable, setDisable] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useRouter();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  //   const handleClickOpen = () => {
  //     setOpenProductDetails(true);
  //   };
  React.useEffect(() => {
    if (searchedData) setDisable(false);
    else setDisable(true);
  }, [searchedData]);
  const handleClose = () => {
    setSearchedData("");
    setOpenProductDetails(false);
  };

  function analytics() {
    history.push(
      `/dashboard/warehouses/${warehouse}/${searchedData.productId}`
    );
    handleCloseOptions();
    handleClose();
  }
  //   console.log(searchedData);
  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={openProductDetails}
        onClose={handleClose}
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
          Product Details
          {((privileges && privileges.Update_Product) || isAdmin) && (
            <span style={{ float: "right", marginRight: "10px" }}>
              <>
                <Tooltip title="Filter">
                  <IconButton
                    id="productDetails-button"
                    disabled={disable}
                    sx={{ float: "right", marginBottom: "10px" }}
                    aria-controls={open ? "productDetails-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    aria-label="Filter"
                    size="large"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="productDetails-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseOptions}
                  PaperProps={{
                    style: {
                      maxHeight: 50 * 4.5,
                      width: "20ch",
                    },
                  }}
                  MenuListProps={{
                    "aria-labelledby": "productDetails-button",
                  }}
                >
                  <MenuItem onClick={analytics}>Analytics</MenuItem>
                  <MenuItem onClick={() => setOpenEditModel(true)}>
                    Edit
                  </MenuItem>
                </Menu>
              </>
              {/* <Button
                variant="contained"
                onClick={() => setOpenEditModel(true)}
                size="small"
                disabled={disable}
                startIcon={<EditIcon fontSize={"small"} />}
              >
                Edit
              </Button> */}
            </span>
          )}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

          <TableTop searchedData={searchedData} />
          <div className="mt-4">
            <Typography variant="subtitle2">
              <b>Shelves: </b>
            </Typography>
            {!shelves ? (
              "Loading..."
            ) : shelves.length > 0 ? (
              <div className="mt-2">
                <ProductShelfTable searchedData={searchedData} />
              </div>
            ) : (
              <Alert icon={false} severity="info">
                Product is not placed on the Shelf yet.
              </Alert>
            )}
          </div>
          {/* <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
          {/* <Button type="submit">Ok</Button> */}
        </DialogActions>
      </Dialog>
      <EditProductModel
        open={openEditModel}
        setOpen={setOpenEditModel}
        searchedData={searchedData}
        setSearchedData={setSearchedData}
      />
    </React.Fragment>
  );
}
