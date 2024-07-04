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
import ProductAddModel from "../../product/productAddModel";
import AddSubShelf from "./addsubShelfModel";
import ProductDetailsOnShelf from "./productDetailsOnShelf";
import axios from "axios";
import { closeMessage } from "../../functions/message";
import { MyContext } from "../../context";
import DeleteShelfModel from "./deleteShelfModel";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditShelf from "../../update/editShelfModel";
import QrCodeIcon from "@mui/icons-material/QrCode";
import generateAndDownloadQRCode from "../../functions/generateQrCode";

export default function EditModel({
  editModelOpen,
  setEditModelOpen,
  shelfClicked: shelfClickedData,
  warehouseId,
  shelves,
  setShelves,
}) {
  const [productOpen, setProductOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [shelfClicked, setShelfClicked] = React.useState(shelfClickedData);
  const [shelfProducts, setShelfProducts] = React.useState("");
  const [shelfProductsUpdate, setShelfProductsUpdate] = React.useState(false);
  const { messageApi, privileges, isAdmin } = React.useContext(MyContext);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editShelf, setEditShelf] = React.useState(false);
  const [openProductDetailsOnShelf, setopenProductDetailsOnShelf] =
    React.useState(false);
  React.useEffect(() => {
    setShelfClicked(shelfClickedData);
  }, [shelfClickedData]);

  //   const [open, setOpen] = React.useState(false);
  //   console.log(editModelOpen);

  //   const handleClickOpen = () => {
  //     setEditModelOpen(true);
  //   };
  function openModel() {
    setOpen(!open);
  }
  const handleClose = (value) => {
    setEditModelOpen(false);
    // setSelectedValue(value);
  };
  const handleCloseSubShelf = () => {
    setOpen(false);
  };

  async function productOnShelf() {
    setShelfProductsUpdate(true);
    setopenProductDetailsOnShelf(true);
    const { data } = await axios.post("/api/product/getProductsOnShelf", {
      warehouse: warehouseId,
      shelfId: shelfClicked._id,
    });
    // console.log(data);
    if (data.status === 200) setShelfProducts(data.data);
    else closeMessage(messageApi, data.msg, "error");
    setShelfProductsUpdate(false);
  }

  return (
    <>
      <Dialog onClose={handleClose} open={editModelOpen}>
        <DialogTitle>
          Settings: {shelfClickedData && shelfClickedData.shelfName}
        </DialogTitle>
        <List sx={{ pt: 0 }}>
          {(isAdmin || (privileges && privileges.Add_Product_To_Shelf)) &&
            shelfClicked &&
            shelfClicked.childrenShelves &&
            shelfClicked.childrenShelves.length === 0 && (
              <ListItem disableGutters>
                <ListItemButton onClick={() => setProductOpen(!productOpen)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <AddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Add Product" />
                </ListItemButton>
              </ListItem>
            )}
          {/* <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("")}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Edit Shelf Name" />
            </ListItemButton>
          </ListItem> */}
          {(isAdmin || (privileges && privileges.Add_Shelf)) && (
            <ListItem disableGutters>
              <ListItemButton onClick={openModel}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <AddIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add Sub-Shelf" />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disableGutters>
            <ListItemButton
              onClick={
                () => productOnShelf()
                // setopenProductDetailsOnShelf(!openProductDetailsOnShelf)
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <ListIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Get Products List" />
            </ListItemButton>
          </ListItem>
          {(isAdmin || (privileges && privileges.Add_Shelf)) && (
            <ListItem disableGutters>
              <ListItemButton onClick={() => setEditShelf(true)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <EditIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Edit Shelf" />
              </ListItemButton>
            </ListItem>
          )}
          {(isAdmin || (privileges && privileges.Delete_Shelf)) && (
            <ListItem disableGutters>
              <ListItemButton onClick={() => setOpenDelete(true)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <DeleteIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Delete shelf" />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disableGutters>
            <ListItemButton
              onClick={
                () =>
                  generateAndDownloadQRCode(
                    shelfClicked && shelfClicked.shelfId,
                    shelfClicked && shelfClicked.shelfName
                  )
                // generateAndDownloadBarcode(
                //   shelfClicked && shelfClicked.shelfId,
                //   shelfClicked && shelfClicked.shelfName
                // )
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  {/* <FontAwesomeIcon icon={faBarcode} /> */}
                  <QrCodeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Download Qr Code" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>

      <ProductAddModel
        productOpen={productOpen}
        setEditModelOpen={setEditModelOpen}
        setProductOpen={setProductOpen}
        shelfClicked={shelfClicked}
        warehouseId={warehouseId}
      />
      <AddSubShelf
        handleClose={handleCloseSubShelf}
        setEditModelOpen={setEditModelOpen}
        open={open}
        warehouseId={warehouseId}
        shelves={shelves}
        setShelves={setShelves}
        shelfClicked={shelfClicked}
      />
      <ProductDetailsOnShelf
        openProductDetailsOnShelf={openProductDetailsOnShelf}
        setOpenProductDetailsOnShelf={setopenProductDetailsOnShelf}
        shelfClicked={shelfClicked}
        warehouseId={warehouseId}
        shelfProducts={shelfProducts}
        shelfProductsUpdate={shelfProductsUpdate}
        setShelfProducts={setShelfProducts}
        updateProducts={productOnShelf}
      />
      <DeleteShelfModel
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        shelfClicked={shelfClicked}
        shelves={shelves}
        handleClose={handleClose}
        setShelves={setShelves}
      />
      <EditShelf
        setEditModelOpen={setEditModelOpen}
        editShelf={editShelf}
        setEditShelf={setEditShelf}
        shelfClicked={shelfClicked}
        shelves={shelves}
        setShelves={setShelves}
      />
    </>
  );
}
