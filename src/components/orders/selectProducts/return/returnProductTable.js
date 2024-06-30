import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import EditMenu from "../EditMenu";
import ReturnQtyModel from "./returnQtyModel";
import EditReturnProduct from "./editReturnProduct";
// import EditProductInOrder from "../../update/editProductInOrder";

// Styling the table cell for customization
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#a6b0c3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// ProductTable component
export default function ReturnProductTable({ data, setValue, total }) {
  const [openMenu, setOpenMenu] = useState(null); // State for menu
  const [clickedRow, setClickedRow] = useState({ data: "", idx: "" }); // State for clicked row data
  //   const [openEdit, setOpenEdit] = useState(false);
  const [editReturnProductModel, setEditReturnProductModel] = useState(false);
  // Function to remove a row
  function handleRemove() {
    if (clickedRow && clickedRow.data) {
      const newArray = [...data];
      newArray.splice(clickedRow.idx, 1); // Remove the clicked row
      setValue(newArray); // Update the state with new array without clicked row
      setClickedRow({ data: "", idx: "" }); // Reset clicked row data
      setOpenMenu(null); // Close the menu
    }
  }

  // Function to handle click event on row
  const handleClick = (event, row, idx) => {
    setOpenMenu(event.currentTarget); // Open the menu
    setClickedRow({ data: { ...row, item: row.item }, idx: idx }); // Set the clicked row data
  };

  return (
    <>
      <TableContainer sx={{ mt: 4 }} component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Order Id</StyledTableCell>
              <StyledTableCell>Return Qty</StyledTableCell>
              <StyledTableCell>Sold Price</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              {/* <StyledTableCell>Payment Status</StyledTableCell> */}
              <StyledTableCell>Variant</StyledTableCell>
              <StyledTableCell>Settings</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => {
              const totalPrice = parseFloat(
                row.item.orderData.price * parseInt(row.returnQty)
              );
              return (
                <React.Fragment key={idx}>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      ...(row.comment && {
                        th: { border: 0 },
                        td: { border: 0 },
                      }),
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.item.productName}
                    </TableCell>
                    <TableCell>{row.item.productId}</TableCell>
                    <TableCell>{row.orderId}</TableCell>
                    <TableCell>{row.returnQty}</TableCell>
                    <TableCell>{row.item.orderData.price}</TableCell>

                    <TableCell>{totalPrice}</TableCell>
                    {/* <TableCell>
                      {(parseFloat(row.item.payment.totalPrice) -
                      row.item.payment.payingAmount
                        ? parseFloat(row.item.payment.payingAmount)
                        : 0) >= totalPrice
                        ? "Paid"
                        : "Not Paid"}
                    </TableCell> */}
                    <TableCell>
                      {row.item.orderData.shelf &&
                      row.item.orderData.shelf !== "Other"
                        ? row.item.orderData.shelf.color
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => handleClick(e, row, idx)}
                        // onClick={() => handleWarehouseModel(row)}
                        aria-label="settings"
                      >
                        <SettingsIcon color="primary" fontSize="small" />
                      </IconButton>
                      {/* EditMenu component */}
                      <EditMenu
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        setClickedRow={setClickedRow}
                        handleRemove={handleRemove}
                        setOpenEdit={setEditReturnProductModel}
                      />
                    </TableCell>
                  </TableRow>
                  {/* Render comment row if comment exists */}
                  {row.comment && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{ paddingTop: "0", paddingBottom: "5px" }}
                      >
                        <Typography variant="caption">
                          <b>Comment:</b> {row.comment}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}

            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell colSpan={5} />
              <TableCell colSpan={1}>
                <b>Total</b>
              </TableCell>
              <TableCell>
                <b>{total}</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <EditReturnProduct
        open={editReturnProductModel}
        setOpen={setEditReturnProductModel}
        itemSelectedFromOrder={clickedRow.data}
        setItemSelectedFromOrder={setClickedRow}
        rowIdx={clickedRow.idx}
        value={data}
        setValue={setValue}
        setOpenMenu={setOpenMenu}

        //   addReturnProduct={addReturnProduct}
      />

      {/* <EditProductInOrder
        open={openEdit}
        setOpen={setOpenEdit}
        clickedRow={clickedRow}
        setOpenMenu={setOpenMenu}
        setClickedRow={setClickedRow}
        value={data}
        setValue={setValue}
      /> */}
    </>
  );
}
