"use client";
import { MyContext } from "@/src/components/context";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import OrderSteps from "@/src/components/orders/orderSteps";
import { Container, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";

const OrderCreate = () => {
  const [customer, setCustomer] = useState(null);
  const [customerInputValue, setCustomerInputValue] = useState("");
  const [orderType, setOrderType] = useState("New Order");
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const paymentOptions = {
    paymentMethod: "Online",
    payingAmount: "",
    paymentOption: "Full",
    paymentId: "",
    totalPrice: 0,
  };
  const [payment, setPayment] = useState(paymentOptions);

  const clear = () => {
    setCustomer(null);
    setCustomerInputValue("");
    setOrders([]);
    setTotal(0);
    setPayment(paymentOptions);
  };

  return (
    <UserAccessLayout>
      <Container requiredprivilege="Create_Order" maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Create New Order</Typography>
            {/* <button onClick={test} className="btn btn-primary">
          test
        </button> */}
          </div>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <OrderSteps
              value={customer}
              setValue={setCustomer}
              inputValue={customerInputValue}
              setInputValue={setCustomerInputValue}
              orders={orders}
              setOrders={setOrders}
              payment={payment}
              setPayment={setPayment}
              total={total}
              setTotal={setTotal}
              clear={clear}
              setOrderType={setOrderType}
              orderType={orderType}
            />
          </Container>
        </Stack>
      </Container>
    </UserAccessLayout>
  );
};

export default OrderCreate;
