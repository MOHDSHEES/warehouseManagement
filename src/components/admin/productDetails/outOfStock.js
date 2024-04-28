import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "productId",
    headerName: "productId",
    minWidth: 130,
  },
  {
    field: "productName",
    headerName: "Product Name",
    minWidth: 250,
    // editable: true,
  },
  {
    field: "quantity",
    headerName: "Total Quantity",
    // sortable: false,
    minWidth: 150,
    // editable: true,
  },
  {
    field: "color",
    headerName: "Out-of-Stock Variant",
    sortable: false,
    minWidth: 250,
    valueGetter: (params) => {
      // console.log(params);
      const colorsWithZeroQuantity = params.row.color
        .filter((color) => color.quantity === "0")
        .map(
          (color) =>
            "color: " +
            (color.color ? color.color : "-") +
            ", Size: " +
            (color.size ? color.size : "-")
        );
      return colorsWithZeroQuantity.length > 0
        ? colorsWithZeroQuantity.join("\n ")
        : "-";
    },
    renderCell: (params) => (
      <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
    ),
  },
  // {
  //   field: "size",
  //   headerName: "Out-of-Stock Sizes",
  //   sortable: false,
  //   minWidth: 250,
  //   valueGetter: (params) => {
  //     const sizeWithZeroQuantity = params.row.size
  //       .filter((size) => size.quantity === "0")
  //       .map((size) => size.size);
  //     return sizeWithZeroQuantity.length > 0
  //       ? sizeWithZeroQuantity.join(", ")
  //       : "-";
  //   },
  // },
  //   {
  //     field: 'age',
  //     headerName: 'Age',
  //     type: 'number',
  //     width: 110,
  //     editable: true,
  //   },
  //   {
  //     field: 'fullName',
  //     headerName: 'Full name',
  //     description: 'This column has a value getter and is not sortable.',
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params) =>
  //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  //   },
];

export default function OutOfStock({ outOfStockData }) {
  //   console.log(outOfStockData.products);
  return (
    <Box
      id="outOfStock"
      sx={{
        width: "100%",
      }}
    >
      <DataGrid
        rows={outOfStockData.products}
        columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        pageSizeOptions={[]}
        getRowId={(row) => row.productId}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
