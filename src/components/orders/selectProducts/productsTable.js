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
import EditMenu from "./EditMenu";
import { IconButton } from "@mui/material";
import EditProductInOrder from "../../update/editProductInOrder";

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
export default function ProductTable({ data, setValue, total }) {
  const [openMenu, setOpenMenu] = useState(null); // State for menu
  const [clickedRow, setClickedRow] = useState({ data: "", idx: "" }); // State for clicked row data
  const [openEdit, setOpenEdit] = useState(false);
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
    setClickedRow({ data: row, idx: idx }); // Set the clicked row data
  };

  return (
    <>
      <TableContainer sx={{ mt: 4 }} component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Qty</StyledTableCell>
              <StyledTableCell>Retail Price</StyledTableCell>
              <StyledTableCell>Discount</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Variant</StyledTableCell>
              <StyledTableCell>Settings</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => {
              const price =
                parseFloat(row.orderData.qty) * parseFloat(row.orderData.price);
              return (
                <React.Fragment key={idx}>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      ...(row.orderData.comment && {
                        th: { border: 0 },
                        td: { border: 0 },
                      }),
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.productName}
                    </TableCell>
                    <TableCell>{row.productId}</TableCell>
                    <TableCell>{row.orderData.qty}</TableCell>
                    <TableCell>
                      {row.retailPrice ? row.retailPrice : "-"}
                    </TableCell>
                    <TableCell>{row.orderData.discount + "%"}</TableCell>
                    <TableCell>{row.orderData.price}</TableCell>
                    <TableCell>
                      {parseFloat(
                        row.orderData.qty * row.orderData.price
                      ).toFixed(2)}
                      {/* {(
                        price -
                        (price * parseFloat(row.orderData.discount)) / 100
                      ).toFixed(2)} */}
                    </TableCell>
                    <TableCell>
                      {row.orderData.shelf && row.orderData.shelf !== "Other"
                        ? `${row.orderData.shelf.color}\n ${
                            row.orderData.shelf.size &&
                            +", " + row.orderData.shelf.size
                          }  `
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
                        setOpenEdit={setOpenEdit}
                      />
                    </TableCell>
                  </TableRow>
                  {/* Render comment row if comment exists */}
                  {row.orderData.comment && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{ paddingTop: "0", paddingBottom: "5px" }}
                      >
                        <Typography variant="caption">
                          <b>Comment:</b> {row.orderData.comment}
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
      <EditProductInOrder
        open={openEdit}
        setOpen={setOpenEdit}
        clickedRow={clickedRow}
        setOpenMenu={setOpenMenu}
        setClickedRow={setClickedRow}
        value={data}
        setValue={setValue}
      />
    </>
  );
}
