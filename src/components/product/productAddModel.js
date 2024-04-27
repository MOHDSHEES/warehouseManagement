import { Fragment, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import { closeMessage, openMessage } from "../functions/message";
import { MyContext } from "../context";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function ProductAddModel({
  productOpen,
  setProductOpen,
  shelfClicked,
  warehouseId,
  setEditModelOpen,
}) {
  //   const [open, setOpen] = useState(false);
  const [shelvesData, setShelvesData] = useState("");
  const { messageApi, productIds } = useContext(MyContext);
  const [shelfData, setShelfData] = useState(shelfClicked);
  const [disable, setdisable] = useState(false);
  const { user } = useContext(MyContext);
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [productIdsData, setProductIdData] = useState(null);
  const [productNameData, setProductNameData] = useState(null);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedProductDetails, setSelectedProductDetails] = useState("");
  //   const [productIds, setProductIds] = useState([]);
  // const [state, setstate] = useState({
  //   productName: "",
  //   productId: "",
  // });
  // console.log(state);
  const Inputchange = (event) => {
    const { name, value } = event.target;
    // setSelectedProductDetails("");
    setColor("");
    if (name === "productId") {
      const selectedData = productIdsData.filter(
        (data) => data.productId === value
      );
      if (selectedData && selectedData.length !== 0)
        setProductName(selectedData[0].productName);
      getProductData(value);
      setProductId(value);
    } else {
      const selectedData = productIdsData.filter(
        (data) => data.productName === value
      );
      if (selectedData && selectedData.length !== 0) setProductName(value);
      setProductId(selectedData[0].productId);
      getProductData(selectedData[0].productId);
    }

    // setstate({
    //   ...state,
    //   [name]: value.trim(),
    // });
  };
  function clear() {
    setProductName("");
    setProductId("");
    setColor("");
    setSize("");
    setSelectedProductDetails("");
    // setstate({
    //   productName: "",
    //   productId: "",
    // });
    setQuantity("");
  }

  async function getShelves() {
    const { data } = await axios.post("/api/shelf/getShelvesRecursive", {
      id: shelfClicked._id,
    });
    if (data && data.status === 200) setShelvesData(data.data);
    else closeMessage(messageApi, data.msg, "error");
  }

  async function getProductData(productId) {
    const { data } = await axios.post("/api/product/getSearchedProduct", {
      warehouse: warehouseId,
      productId: productId,
    });
    // console.log(data);
    if (data && data.status === 200) {
      setSelectedProductDetails(data.data);
    }
    // else closeMessage(messageApi, data.msg, "error");
  }

  // async function getProductIds() {
  //   flag = 0;
  //   const { data } = await axios.post("/api/product/getProductIds", {
  //     warehouse: warehouseId,
  //   });
  //   if (data && data.status === 200) {
  //     setProductIdData(data.data);
  //     setProductIds([
  //       ...productIds,
  //       { warehouseId: warehouseId, productIds: data.data },
  //     ]);
  //   } else closeMessage(messageApi, data.msg, "error");
  // }
  useEffect(() => {
    const filteredItem = productIds.find(
      (item) => item.warehouseId === warehouseId
    );
    if (filteredItem) {
      setProductIdData(filteredItem.productIds);
    }

    // getProductIds();
  }, [productIds]);

  useEffect(() => {
    if (shelfClicked) {
      setShelfData(shelfClicked);
      getShelves();
    }
  }, [shelfClicked]);
  const handleClose = () => {
    clear();
    setProductOpen(false);
  };

  const handleKeyDown = (event) => {
    // Check if the pressed key is a dot (.)
    if (isNaN(Number(event.key)) && event.key !== "Backspace") {
      event.preventDefault();
    }
    // if (
    //   event.key === "." ||
    //   event.key === "-" ||
    //   event.key.toLowerCase() === "e"
    // ) {
    //   event.preventDefault();
    // }
  };

  async function submitHandler(e) {
    e.preventDefault();
    setdisable(true);
    openMessage(messageApi, "Adding product...");
    if (user && user._id) {
      const { data } = await axios.post("/api/product/pushToShelf", {
        detail: {
          shelves: {
            shelf: shelfData._id,
            quantity: quantity,
            color: color,
            size: size,
          },
        },
        productId: productId,
        warehouse: warehouseId,
      });
      // console.log(data);
      if (data && data.status === 200) {
        // setUser(data.data);
        // router.push("/dashboard/warehouses");
        closeMessage(messageApi, "Product Sucessfully added", "success");
        clear();
        setEditModelOpen(false);
        handleClose();
      } else if (data && data.status === 500)
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
        open={productOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            submitHandler(event);
          },
        }}
      >
        <DialogTitle>Product Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Product will be added to:{" "}
            {shelvesData && shelvesData.length > 0
              ? shelvesData.map((shelf, idx) => (
                  <>
                    <b>{shelf.shelfName}</b>
                    {idx < shelvesData.length - 1 && <ArrowRightIcon />}
                  </>
                ))
              : "Loading..."}
          </DialogContentText>
          {/* <Typography variant="body2" display="block" gutterBottom>
            Product will be added to:{" "}
            {shelvesData && shelvesData.length > 0
              ? shelvesData.map((shelf, idx) => (
                  <>
                    <b>{shelf.shelfName}</b>
                    {idx < shelvesData.length - 1 && <ArrowRightIcon />}
                  </>
                ))
              : "Loading..."}
          </Typography> */}
          <Grid container spacing={2} className="mt-1">
            <Grid item xs={12} sm={12}>
              {/* <TextField
                // autoFocus
                // required
                disabled
                margin="dense"
                id="productName"
                name="productName"
                label="Product Name"
                value={productName}
                // onChange={Inputchange}
                fullWidth
              /> */}
              <TextField
                required
                margin="dense"
                select
                id="productName"
                name="productName"
                label="Product Name"
                value={productName}
                onChange={Inputchange}
                fullWidth
                // variant="standard"
              >
                {!productIdsData ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : productIdsData && productIdsData.length > 0 ? (
                  productIdsData.map((option, id) => (
                    <MenuItem key={id} value={option.productName}>
                      {option.productName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No product found</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                required
                margin="dense"
                select
                id="productId"
                name="productId"
                label="Product Id"
                value={productId}
                onChange={Inputchange}
                fullWidth
                // variant="standard"
              >
                {!productIdsData ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : productIdsData && productIdsData.length > 0 ? (
                  productIdsData.map((option, id) => (
                    <MenuItem key={id} value={option.productId}>
                      {option.productId}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No product found</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                margin="dense"
                id="quantity"
                name="quantity"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/\s/g, ""))}
                // newValue.replace(/\s/g, '')
                onKeyDown={handleKeyDown}
                fullWidth
                // variant="standard"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                id="shelf"
                name="shelf"
                defaultValue={shelfData ? shelfData.shelfName : ""}
                InputProps={{
                  readOnly: true,
                }}
                label="Shelf"
                fullWidth
                // variant="standard"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="color"
                name="color"
                select
                label="Variant"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
                // variant="standard"
              >
                {!productId ? (
                  <MenuItem value="">Please select Product Id...</MenuItem>
                ) : selectedProductDetails &&
                  selectedProductDetails.color.length > 0 ? (
                  [
                    <MenuItem key="mix" value="Mix">
                      Mix
                    </MenuItem>,
                    ...selectedProductDetails.color.map((option, id) => (
                      <MenuItem
                        key={id}
                        value={
                          "color: " +
                          (option.color ? option.color : "-") +
                          ", Size: " +
                          (option.size ? option.size : "-")
                        }
                      >
                        color: {option.color ? option.color : "-"}, size:{" "}
                        {option.size ? option.size : "-"}
                      </MenuItem>
                    )),
                  ]
                ) : selectedProductDetails &&
                  selectedProductDetails.color.length === 0 ? (
                  <MenuItem value="">
                    No Colors available for this item
                  </MenuItem>
                ) : (
                  <MenuItem value="">Loading...</MenuItem>
                )}
              </TextField>
            </Grid>
            {/* <Grid item xs={6}>
              <TextField
                margin="dense"
                id="size"
                name="size"
                select
                label="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                fullWidth
              >
                {!productId ? (
                  <MenuItem value="">Please select Product Id...</MenuItem>
                ) : selectedProductDetails &&
                  selectedProductDetails.size.length > 0 ? (
                  [
                    <MenuItem key="mix" value="Mix">
                      Mix
                    </MenuItem>,
                    ...selectedProductDetails.size.map((option, id) => (
                      <MenuItem key={id} value={option.size}>
                        {option.size}
                      </MenuItem>
                    )),
                  ]
                ) : selectedProductDetails &&
                  selectedProductDetails.size.length === 0 ? (
                  <MenuItem value="">No Sizes available for this item</MenuItem>
                ) : (
                  <MenuItem value="">Loading...</MenuItem>
                )}
              </TextField>
            </Grid> */}
          </Grid>
          {/* <DialogContentText className="mt-3">
            <Typography variant="caption" display="block" gutterBottom>
              Color example: red,navy blue,green
            </Typography>
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={disable} type="submit">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
