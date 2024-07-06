import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
// import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import UpdateCustomerDetails from "../update/updateCustomer";
// import UpdateWarehouseDetails from "../update/warehouseDetailsModel";

export default function CustomerMenuModel({
  customerModel,
  setCustomerModel,
  customerClicked: customerClickedData,
  setCustomerClicked: setCustomerClickedData,
  setCustomers,
  customers,
}) {
  const [customerClicked, setCustomerClicked] =
    React.useState(customerClickedData);

  //   console.log(customerClicked);
  //   const [openWarehouse, setOpenWarehouse] = React.useState(false);
  const [openCustomer, setOpenCustomer] = React.useState(false);

  React.useEffect(() => {
    setCustomerClicked(customerClickedData);
  }, [customerClickedData]);

  const handleClose = (value) => {
    setCustomerModel(false);
    setCustomerClicked(null);
    setCustomerClickedData(null);
    // setSelectedValue(value);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={customerModel}>
        <DialogTitle>Settings:</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => setOpenCustomer(true)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <EditIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Edit Details" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
      <UpdateCustomerDetails
        open={openCustomer}
        setOpen={setOpenCustomer}
        customerClicked={customerClicked}
        handleCustomerMenuModel={handleClose}
        setCustomers={setCustomers}
        customers={customers}
      />
      {/* <UpdateWarehouseDetails
        openCustomer={openCustomer}
        handleEditWarehouseModel={handleClose}
        setOpenCustomer={setOpenCustomer}
        customerClicked={customerClicked}
      /> */}
    </>
  );
}
