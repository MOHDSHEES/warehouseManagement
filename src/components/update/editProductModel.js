import React, { Fragment, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddProductForm from "../product/addProductForm";
import { MyContext } from "../context";
import axios from "axios";
import { closeMessage, openMessage } from "../functions/message";
import { signOut } from "next-auth/react";

export default function EditProductModel({
  open,
  setOpen,
  searchedData,
  setSearchedData,
}) {
  const handleClose = () => {
    clear();
    setOpen(false);
  };
  //   console.log(searchedData);
  const [disable, setdisable] = useState(false);
  const { user, messageApi } = useContext(MyContext);
  const [quantity, setQuantity] = useState(searchedData.quantity);
  const [productId, setProductId] = useState(searchedData.productId);
  const [productName, setProductName] = useState("");
  const [colorQuantities, setColorQuantities] = useState([
    { color: "", quantity: 0 },
  ]);
  // const [sizeQuantities, setSizeQuantities] = useState([
  //   { size: "", quantity: 0 },
  // ]);
  // const [color, setColor] = useState("");
  // const [size, setSize] = useState("");
  const [state, setstate] = useState({
    wholesalePrice: "",
    retailPrice: "",
  });
  const Inputchange = (event) => {
    const { name, value } = event.target;
    setstate({
      ...state,
      [name]: value.trim(),
    });
  };

  useEffect(() => {
    if (searchedData) {
      setProductName(searchedData.productName);
      setProductId(searchedData.productId);
      setQuantity(searchedData.quantity);
      // setSizeQuantities(
      //   searchedData.size.length > 0
      //     ? searchedData.size
      //     : [{ size: "", quantity: 0 }]
      // );
      setColorQuantities(
        searchedData.color.length > 0
          ? searchedData.color
          : [{ color: "", quantity: 0 }]
      );
      setstate({
        wholesalePrice: searchedData.wholesalePrice,
        retailPrice: searchedData.retailPrice,
      });
    }
  }, [searchedData, open]);

  function clear() {
    setstate({
      wholesalePrice: "",
      retailPrice: "",
    });
    setQuantity("");
    setProductId("");
    setProductName("");
    // setColor("");
    setColorQuantities([{ color: "", quantity: 0 }]);
    // setSizeQuantities([{ size: "", quantity: 0 }]);
  }

  async function submitHandler(e) {
    e.preventDefault();
    setdisable(true);
    // checking if color is provided else retrning empty array
    const validColorQuantities = colorQuantities.filter(
      (entry) => entry.color && entry.color.trim() !== ""
    );
    // const validSizeQuantities = sizeQuantities.filter(
    //   (entry) => entry.size && entry.size.trim() !== ""
    // );
    openMessage(messageApi, "Updating product...");
    if (user && user._id) {
      const details = {
        ...state,
        _id: searchedData._id,
        productId: productId,
        productName: productName.trim(),
        quantity: quantity,
        color: validColorQuantities,
        // size: validSizeQuantities,
        warehouse: searchedData.warehouse,
      };
      const { data } = await axios.post("/api/product/update", {
        detail: details,
      });
      if (data && data.status === 200) {
        // const dataToPush = [
        //   {
        //     _id: data.data._id,
        //     productName: data.data.productName,
        //     productId: data.data.productId,
        //   },
        // ];
        // const updatedData = productIds.map((entry) =>
        //   entry.warehouseId === params.id
        //     ? { ...entry, productIds: [...entry.productIds, ...dataToPush] }
        //     : entry
        // );
        // setProductIds(updatedData);
        // console.log({ ...searchedData, ...details });
        setSearchedData({ ...searchedData, ...details });
        closeMessage(messageApi, "Product Sucessfully updated", "success");
        handleClose();
      } else if (data.status === 500)
        closeMessage(messageApi, data.msg, "error");
    } else signOut();
    setdisable(false);
  }

  return (
    <Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        maxWidth="lg"
        // onClose={handleClose}
      >
        <DialogTitle>Edit:</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <AddProductForm
            productName={productName}
            setProductName={setProductName}
            productId={productId}
            setProductId={setProductId}
            quantity={quantity}
            setQuantity={setQuantity}
            state={state}
            Inputchange={Inputchange}
            colorQuantities={colorQuantities}
            setColorQuantities={setColorQuantities}
            // sizeQuantities={sizeQuantities}
            // setSizeQuantities={setSizeQuantities}
            submitHandler={submitHandler}
            disable={disable}
            component="update"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <Button type="submit">Edit</Button> */}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
