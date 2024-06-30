import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReturnQtyModel from "./returnQtyModel";

const OrderProductsTable = ({
  data,
  itemSelectedFromOrder,
  setItemSelectedFromOrder,
  addReturnProduct,
}) => {
  const rowsPerPage = 10;
  const page = 0;
  const [returnQtyModel, setReturnQtyModel] = useState(false);

  function returnItem(item) {
    setItemSelectedFromOrder(item);
    setReturnQtyModel(true);
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <CollapsibleRow key={idx} row={row} returnItem={returnItem} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ReturnQtyModel
        open={returnQtyModel}
        setOpen={setReturnQtyModel}
        itemSelectedFromOrder={itemSelectedFromOrder}
        setItemSelectedFromOrder={setItemSelectedFromOrder}
        addReturnProduct={addReturnProduct}
      />
    </>
  );
};

const CollapsibleRow = ({ row, returnItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        onClick={() => {
          row.item.length <= 1 && returnItem(row);
        }}
        tabIndex={-1}
      >
        <TableCell>
          {row.item.length > 1 ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : null}
        </TableCell>
        {columns.map((column) => {
          const value = column.accessor(row);
          return (
            <TableCell key={column.id} align={column.align}>
              {value ? value : "-"}
            </TableCell>
          );
        })}
      </TableRow>
      {row.item.length > 1 && (
        <>
          {/* <Typography
            variant="subtitle1"
            gutterBottom
            component="div"
            sx={{ margin: "20px" }}
          >
            Variants
          </Typography> */}
          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={columns.length + 1}
            >
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1} sx={{ m: "20px" }}>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        {nestedColumns.map((column) => (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.item.map((item, idx) => (
                        <TableRow
                          hover
                          key={idx}
                          onClick={() =>
                            returnItem({
                              date: row.date,
                              item: [item],
                              orderId: row.orderId,
                            })
                          }
                        >
                          {nestedColumns.map((column) => {
                            const value = column.accessor(item);
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value ? value : "-"}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};

export default OrderProductsTable;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: "bold",
    // backgroundColor: "#a6b0c3",
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const columns = [
  {
    id: "orderId",
    label: "Order Id",
    minWidth: 150,
    accessor: (row) => row.orderId,
  },
  {
    id: "Date",
    label: "Date",
    minWidth: 100,
    accessor: (row) => new Date(row.date).toLocaleDateString(),
  },
  {
    id: "Qty",
    label: "Qty",
    minWidth: 70,
    accessor: (row) =>
      row.item.reduce((acc, item) => acc + Number(item.orderData.qty), 0),
  },
  {
    id: "Price",
    label: "Sold Price",
    minWidth: 70,
    accessor: (row) => Number(row.item[0].orderData.price),
    // row.item.reduce((acc, item) => acc + Number(item.orderData.price), 0),
  },
  {
    id: "PreviousReturns",
    label: "Previous Returns",
    minWidth: 70,
    accessor: (row) =>
      row.item[0].return &&
      row.item[0].return.quantity &&
      row.item[0].return.quantity,
  },
  {
    id: "Variant",
    label: "Variant",
    minWidth: 150,
    accessor: (row) =>
      row.item.length === 1 ? row.item[0].orderData.shelf.color : "Multiple",
  },
  {
    id: "ProductId",
    label: "Product Id",
    minWidth: 150,
    accessor: (row) => row.item[0].productId,
  },
  {
    id: "ProductName",
    label: "Product Name",
    minWidth: 150,
    accessor: (row) => row.item[0].productName,
  },
];

const nestedColumns = [
  // {
  //   id: "productName",
  //   label: "Product Name",
  //   minWidth: 150,
  //   accessor: (item) => item.productName,
  // },
  {
    id: "productId",
    label: "Product Id",
    minWidth: 150,
    accessor: (item) => item.productId,
  },
  {
    id: "qty",
    label: "Qty",
    minWidth: 70,
    accessor: (item) => item.orderData.qty,
  },
  {
    id: "price",
    label: "Sold Price",
    minWidth: 70,
    accessor: (item) => item.orderData.price,
  },
  {
    id: "PreviousReturns",
    label: "Previous Returns",
    minWidth: 70,
    accessor: (item) =>
      item.return && item.return.quantity ? item.return.quantity : "-",
  },
  {
    id: "variant",
    label: "Variant",
    minWidth: 150,
    accessor: (item) => item.orderData.shelf.color,
  },
];
