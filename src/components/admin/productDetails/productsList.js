import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveItemModel from "./removeItemModel";
import ProductTransferModel from "./productTransferModel";
import { MyContext } from "../../context";

export default function ProductList({
  data,
  warehouseId,
  setShelfProducts,
  updateProducts,
}) {
  const [anchorEls, setAnchorEls] = React.useState({});
  const { privileges, isAdmin } = React.useContext(MyContext);
  const [removeItemModel, setRemoveItemModel] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [transferModel, setTransferModel] = React.useState(false);
  const handleClick = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }));
  };
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
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   sortable: false,
    //   minWidth: 80,
    //   renderCell: (params) => {
    //     const open = Boolean(anchorEls[params.row.UniqueId]);
    //     return (
    //       <>
    //         {/* <Tooltip title="Actions"> */}
    //         <IconButton
    //           id={`action-button-${params.row.UniqueId}`}
    //           sx={{ float: "right", marginBottom: "10px" }}
    //           aria-controls={
    //             open ? `basic-menu-${params.row.UniqueId}` : undefined
    //           }
    //           aria-haspopup="true"
    //           aria-expanded={open ? "true" : undefined}
    //           onClick={(event) => handleClick(event, params.row.UniqueId)}
    //           aria-label="actions"
    //           size="large"
    //         >
    //           <MoreVertIcon />
    //         </IconButton>
    //         {/* </Tooltip> */}
    //         <Menu
    //           id={`basic-menu-${params.row.UniqueId}`}
    //           anchorEl={anchorEls[params.row.UniqueId]}
    //           open={open}
    //           onClose={() => handleClose(params.row.UniqueId)}
    //           PaperProps={{
    //             style: {
    //               maxHeight: 50 * 4.5,
    //               width: "20ch",
    //             },
    //           }}
    //           MenuListProps={{
    //             "aria-labelledby": `action-button-${params.row.UniqueId}`,
    //           }}
    //         >
    //           <MenuItem onClick={() => handleAction(params.row, "Transfer")}>
    //             Transfer
    //           </MenuItem>
    //           <MenuItem onClick={() => handleAction(params.row, "Remove")}>
    //             Remove
    //           </MenuItem>
    //         </Menu>
    //       </>
    //     );
    //   },
    // },
  ];

  if (privileges.Add_Product_To_Shelf || isAdmin) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 80,
      renderCell: (params) => {
        const open = Boolean(anchorEls[params.row.UniqueId]);
        return (
          <>
            <IconButton
              id={`action-button-${params.row.UniqueId}`}
              sx={{ float: "right", marginBottom: "10px" }}
              aria-controls={
                open ? `basic-menu-${params.row.UniqueId}` : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleClick(event, params.row.UniqueId)}
              aria-label="actions"
              size="large"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id={`basic-menu-${params.row.UniqueId}`}
              anchorEl={anchorEls[params.row.UniqueId]}
              open={open}
              onClose={() => handleClose(params.row.UniqueId)}
              PaperProps={{
                style: {
                  maxHeight: 50 * 4.5,
                  width: "20ch",
                },
              }}
              MenuListProps={{
                "aria-labelledby": `action-button-${params.row.UniqueId}`,
              }}
            >
              <MenuItem onClick={() => handleAction(params.row, "Transfer")}>
                Transfer
              </MenuItem>
              <MenuItem onClick={() => handleAction(params.row, "Remove")}>
                Remove
              </MenuItem>
            </Menu>
          </>
        );
      },
    });
  }

  const handleAction = (row, action) => {
    setSelectedRow(row);
    handleClose(row.UniqueId);
    switch (action) {
      case "Transfer":
        setTransferModel(true);
        // Add your edit logic here
        break;
      case "Remove":
        setRemoveItemModel(true);
        // console.log(`Delete ${row.productId}`);
        // Add your delete logic here
        break;
      default:
        break;
    }
  };

  const rows = data
    .map((product) => {
      const nestedShelf = product.shelves
        .filter((shelf) => {
          if (shelf.shelf) return shelf;
        })
        .map((shelf, idx) => {
          return {
            No: idx + 1,
            UniqueId: idx + product.productId,
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
            shelfId: shelf.shelf && shelf.shelf._id,
          };
        });
      return nestedShelf;
    })
    .flat();
  return (
    <>
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
      <RemoveItemModel
        open={removeItemModel}
        setOpen={setRemoveItemModel}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        warehouseId={warehouseId}
        setShelfProducts={setShelfProducts}
        shelfProducts={data}
        updateProducts={updateProducts}
      />
      <ProductTransferModel
        warehouse={warehouseId}
        open={transferModel}
        setOpen={setTransferModel}
        selectedRow={selectedRow}
        updateProducts={updateProducts}
      />
    </>
  );
}
