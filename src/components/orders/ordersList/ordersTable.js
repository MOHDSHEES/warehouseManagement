"use client";
import React, { Fragment, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { AlertTitle, Button, IconButton, LinearProgress } from "@mui/material";
// import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import OrderDetailsModel from "./orderDetailsModel";

const OrdersTable = ({ orders, loading }) => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");

  function handleOrderDetailsModel(data) {
    setSelectedOrder(data);
    setOpen(true);
  }
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading && !orders ? (
          <LinearProgress />
        ) : !orders || orders.length === 0 ? (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert style={{ fontSize: "15px" }} severity="info">
              <AlertTitle>
                <b>No Orders found!</b>
              </AlertTitle>
              You can create one by clicking &quot;Create New Order&quot;.
            </Alert>
          </Stack>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => {
                      return (
                        <StyledTableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((data, idx) => {
                    return (
                      <TableRow
                        className="pointer"
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={idx}
                      >
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {idx + 1}
                        </TableCell>
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {data.orderId}
                        </TableCell>
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {data.party.name}
                        </TableCell>
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {data.orderType}
                        </TableCell>
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {data.payment.totalPrice}
                        </TableCell>
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {data.payment.payingAmount}
                        </TableCell>
                        <TableCell
                          onClick={() => handleOrderDetailsModel(data)}
                        >
                          {data.createdAt.substring(0, 10)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            // onClick={() => handleOrderDetailsModel(data)}
                            aria-label="settings"
                          >
                            <SettingsIcon color="primary" fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
      <OrderDetailsModel
        open={open}
        setOpen={setOpen}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </>
  );
};

export default OrdersTable;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#a6b0c3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const columns = [
  { id: "#", label: "#" },
  { id: "orderId", label: "Order Id", minWidth: 120 },
  {
    id: "name",
    label: "Customer Name",
    minWidth: 100,
    // arrayLength: true,
  },
  {
    id: "orderType",
    label: "Type",
    minWidth: 100,
    // arrayLength: true,
  },
  {
    id: "TotalPrice",
    label: "TotalPrice",
    minWidth: 100,
  },
  {
    id: "paid",
    label: "Paid Amount",
    minWidth: 100,
  },
  {
    id: "date",
    label: "Date",
    minWidth: 100,
  },
  {
    id: "settings",
    label: "Settings",
    minWidth: 100,
    align: "center",
    //   format: (value, row, handleWarehouseModel) => (
    //     <IconButton
    //       onClick={() => handleWarehouseModel(row)}
    //       aria-label="settings"
    //     >
    //       <SettingsIcon color="primary" fontSize="small" />
    //     </IconButton>
    //   ),
  },
];
