import React, { useContext } from "react";
import Box from "@mui/material/Box";
import { TextField, Unstable_Grid2 as Grid, Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PaymentSelect from "./paymentSelect";
import { MyContext } from "../../context";
import axios from "axios";
import { closeMessage } from "../../functions/message";

export default function Payment({
  payment,
  setPayment,
  total,
  party,
  order,
  setActiveStep,
  clear,
  setInvoiceData,
  orderType,
}) {
  const { user, messageApi, setBackDropOpen } = useContext(MyContext);
  function inputHandler(e) {
    const { name, value } = e.target;
    setPayment({
      ...payment,
      [name]: value,
    });
  }
  // console.log(order);

  const orderSubmitHandler = async (e) => {
    e.preventDefault();
    setBackDropOpen(true);
    if (orderType === "New Order") {
      const { data } = await axios.post("/api/order/create", {
        data: {
          payment: {
            ...payment,
            payingAmount: parseFloat(payment.payingAmount),
            totalPrice: parseFloat(total),
          },
          party: party._id,
          order: order,
          placedBy: user._id,
          orderType: orderType,
          company: user.company && user.company._id,
        },
      });
      if (data.status === 200) {
        setInvoiceData(data.data);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        clear();
      } else {
        closeMessage(messageApi, data.msg, "error");
      }
    } else {
      const totalAmountToReturn = calculateTotalReturnAmount(order);
      const { data } = await axios.post("/api/order/return", {
        data: {
          payment: {
            ...payment,
            payingAmount: parseFloat(payment.payingAmount),
            totalPrice: parseFloat(total),
          },
          party: party._id,
          order: order,
          placedBy: user._id,
          orderType: orderType,
          company: user.company && user.company._id,
        },
        totalAmountToReturn: totalAmountToReturn,
      });
      if (data.status === 200) {
        setInvoiceData(data.data);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        clear();
      } else {
        closeMessage(messageApi, data.msg, "error");
      }
    }
    // console.log(data);

    setBackDropOpen(false);
  };
  // console.log(order);

  function calculateTotalReturnAmount(data) {
    let totalReturnAmount = 0;

    data.forEach((entry) => {
      const { item, returnQty } = entry;
      const { orderData, payment } = item;

      const maxReturnAmount =
        parseFloat(payment.totalPrice) -
        (parseFloat(payment.payingAmount) || 0);
      const returnAmount = parseInt(returnQty) * parseFloat(orderData.price);

      totalReturnAmount += Math.min(returnAmount, maxReturnAmount);
    });

    return totalReturnAmount;
  }
  return (
    <form onSubmit={orderSubmitHandler}>
      <Box>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center" }}
          className="mt-1 mb-3"
        >
          <Grid xs={6} sm={6}>
            <PaymentSelect payment={payment} setPayment={setPayment} />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center" }}
          className="mt-1 mb-3"
        >
          <Grid xs={6} sm={3}>
            <TextField
              id="order-total"
              name="total-price"
              value={total}
              // onChange={Inputchange}
              // value={state.qty}
              required
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              size="medium"
              label="Total Price"
              variant="outlined"
            />
          </Grid>
          <Grid xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="payment-method">Select Payment Option</InputLabel>
              <Select
                size="medium"
                //   defaultValue={"Full"}
                name="paymentOption"
                disabled={
                  payment && payment.paymentMethod === "Pay Later" && true
                }
                labelId="paymentOption"
                value={payment.paymentOption}
                onChange={inputHandler}
                label="Select Payment Option"
              >
                <MenuItem value={"Full"}>Full</MenuItem>
                <MenuItem value={"Installment"}>Installment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={6} sm={3}>
            <TextField
              id="paying-amt"
              name="payingAmount"
              value={payment.payingAmount}
              onChange={inputHandler}
              disabled={
                payment && payment.paymentMethod === "Pay Later" && true
              }
              required
              fullWidth
              autoComplete="off"
              size="medium"
              label={`${
                orderType === "New Order" ? "Paying Amount" : "Return Amount"
              }`}
              variant="outlined"
            />
          </Grid>
          <Grid xs={6} sm={6}>
            <TextField
              id="paymentId"
              name="paymentId"
              value={payment.paymentId}
              autoComplete="off"
              onChange={inputHandler}
              disabled={payment && payment.paymentMethod !== "Online" && true}
              required
              fullWidth
              size="medium"
              label="Payment Id"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          style={{ float: "right" }}
          sx={{ mb: 4 }}
          variant="outlined"
        >
          Confirm
        </Button>
      </Box>
    </form>
  );
}
