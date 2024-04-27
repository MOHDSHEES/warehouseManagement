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
import UpdateWarehouseDetails from "../update/warehouseDetailsModel";

export default function EditWarehouseModel({
  warehouseEditModel,
  setWarehouseEditModel,
  warehouseClicked: warehouseClickedData,
}) {
  const [warehouseClicked, setWarehouseCliked] =
    React.useState(warehouseClickedData);

  const [openWarehouse, setOpenWarehouse] = React.useState(false);

  React.useEffect(() => {
    setWarehouseCliked(warehouseClickedData);
  }, [warehouseClickedData]);

  const handleClose = (value) => {
    setWarehouseEditModel(false);
    // setSelectedValue(value);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={warehouseEditModel}>
        <DialogTitle>Settings: {warehouseClicked.warehouseName}</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => setOpenWarehouse(!openWarehouse)}>
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
      <UpdateWarehouseDetails
        openWarehouse={openWarehouse}
        handleEditWarehouseModel={handleClose}
        setOpenWarehouse={setOpenWarehouse}
        warehouseClicked={warehouseClicked}
      />
    </>
  );
}
