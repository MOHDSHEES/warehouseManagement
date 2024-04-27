import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "productId", headerName: "productId", minWidth: 130 },
  {
    field: "productName",
    headerName: "Product Name",
    minWidth: 250,
    // editable: true,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    // sortable: false,
    minWidth: 150,
    // editable: true,
  },
  {
    field: "color",
    headerName: "Variant",
    // sortable: false,
    minWidth: 200,

    // editable: true,
  },
  // {
  //   field: "size",
  //   headerName: "Size",
  //   // sortable: false,
  //   minWidth: 150,

  //   // editable: true,
  // },
  {
    field: "shelf",
    headerName: "Shelf",
    // sortable: false,
    minWidth: 150,

    // editable: true,
  },
  {
    field: "wholesalePrice",
    headerName: "Wholesale Price",
    // sortable: false,
    minWidth: 150,

    // editable: true,
  },
  {
    field: "retailPrice",
    headerName: "Retail Price",
    // sortable: false,
    minWidth: 150,

    // editable: true,
  },

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

export default function ProductList({ data }) {
  //   console.log(outOfStockData.products);
  //   console.log(data);

  const rows = data
    .map((product) => {
      const nestedShelf = product.shelves
        .filter((shelf) => {
          if (shelf.shelf) return shelf;
        })
        .map((shelf, idx) => {
          // console.log(shelf);
          return {
            No: idx + 1,
            id: product.productId,
            productId: product.productId,
            productName: product.productName,
            quantity: shelf.quantity || "-",
            retailPrice: product.retailPrice,
            wholesalePrice: product.wholesalePrice,
            shelf:
              shelf.shelf &&
              shelf.shelf.shelfPath &&
              shelf.shelf.shelfPath.length > 0
                ? shelf.shelf.shelfPath.join(" > ")
                : "-",
            color: shelf.color && shelf.color.trim() !== "" ? shelf.color : "-",
            size: shelf.size && shelf.size.trim() !== "" ? shelf.size : "-",
          };
        });
      // return {
      //   id: product.productId,
      //   productId: product.productId,
      //   productName: product.productName,
      //   quantity: nestedShelf && nestedShelf[0] ? nestedShelf[0].quantity : "-",
      //   retailPrice: product.retailPrice,
      //   wholesalePrice: product.wholesalePrice,
      //   shelf:
      //     nestedShelf &&
      //     nestedShelf[0].shelf.shelfPath &&
      //     nestedShelf[0].shelf.shelfPath.length > 0
      //       ? nestedShelf[0].shelf.shelfPath.join(" > ")
      //       : "-",
      //   color:
      //     nestedShelf && nestedShelf[0] && nestedShelf[0].color.trim() !== ""
      //       ? nestedShelf[0].color
      //       : "-",
      //   size:
      //     nestedShelf &&
      //     nestedShelf.length > 0 &&
      //     nestedShelf[0].size.trim() !== ""
      //       ? nestedShelf[0].size
      //       : "-",
      // };
      return nestedShelf;
    })
    .flat();
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        pageSizeOptions={[]}
        getRowId={(row) => row.No + "-" + row.productId}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
