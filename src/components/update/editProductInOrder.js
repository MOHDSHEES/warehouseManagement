import React, { Fragment, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { MyContext } from "../context";
import ChooseProductsForm from "../orders/selectProducts/chooseProductsForm";
import { closeMessage } from "../functions/message";

export default function EditProductInOrder({
  open,
  setOpen,
  clickedRow,
  setClickedRow,
  setOpenMenu,
  value,
  setValue,
}) {
  const handleClose = () => {
    setClickedRow({ data: "", idx: "" });
    setOpenMenu(false);
    setOpen(false);
  };
  const { messageApi } = useContext(MyContext);

  const options = [];
  const loading = false;
  const [selectedValue, setSelectedValue] = useState();
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState({
    discount: 0,
    qty: 1,
    price: 1,
    comment: "",
    shelf: "",
  });

  const inputPriceChangeHandler = (event) => {
    // setValidated(false);
    const { name, value } = event.target;
    if (name === "price") {
      const newPrice = parseFloat(value.trim());
      const retailPrice = parseFloat(clickedRow.data.retailPrice);
      const newDiscount = ((retailPrice - newPrice) / retailPrice) * 100;
      setState({
        ...state,
        [name]: value.trim(),
        discount: newDiscount.toFixed(2),
      });
    } else {
      const newDiscount = parseFloat(value.trim());
      const retailPrice = parseFloat(clickedRow.data.retailPrice);
      const newPrice = retailPrice - retailPrice * (newDiscount / 100);
      setState({
        ...state,
        [name]: value.trim(),
        price: newPrice.toFixed(2),
      });
    }
  };

  useEffect(() => {
    if (clickedRow && clickedRow.data) {
      setSelectedValue(clickedRow.data.productName);
      setState({
        discount: clickedRow.data.orderData.discount,
        qty: clickedRow.data.orderData.qty,
        price: clickedRow.data.orderData.price,
        comment: clickedRow.data.orderData.comment,
        shelf: clickedRow.data.orderData.shelf,
      });
    }
  }, [clickedRow]);

  const Inputchange = (event) => {
    const { name, value } = event.target;
    // setState({
    //   ...state,
    //   [name]: value,
    // });
    if (value === "")
      setState({
        ...state,
        [name]: 0,
      });
    else {
      if (name === "qty")
        setState({
          ...state,
          [name]: parseInt(value.trim()),
        });
      else
        setState({
          ...state,
          [name]: parseFloat(value.trim()),
        });
    }
  };

  function updateData(e) {
    e.preventDefault();
    const updatedValue = [...value]; // Creating a copy of the original array
    updatedValue[clickedRow.idx] = {
      ...value[clickedRow.idx],
      orderData: state,
    };
    setValue(updatedValue);
    closeMessage(messageApi, "updated Successfully", "success");
    handleClose();
  }

  return (
    <Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} maxWidth="lg" onClose={handleClose}>
        <DialogTitle>Edit:</DialogTitle>
        <form onSubmit={updateData}>
          <DialogContent>
            {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

            <ChooseProductsForm
              options={options}
              selectedValue={selectedValue}
              loading={loading}
              inputValue={inputValue}
              setSelectedValue={setSelectedValue}
              setInputValue={setInputValue}
              Inputchange={Inputchange}
              inputPriceChangeHandler={inputPriceChangeHandler}
              state={state}
              setState={setState}
              component="update"
              retailPrice={
                clickedRow.data.retailPrice ? clickedRow.data.retailPrice : "0"
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              //   style={{ float: "right" }}
              //   sx={{ mb: 4 }}
              variant="contained"
            >
              Update Product
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
