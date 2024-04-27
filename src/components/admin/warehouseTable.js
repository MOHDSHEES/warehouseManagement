"use client";
import * as React from "react";
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
import { MyContext } from "../context";
import axios from "axios";
import { closeMessage } from "../functions/message";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { AlertTitle, Button, IconButton, LinearProgress } from "@mui/material";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import EditWarehouseModel from "./editWarehouseModel";

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
  { id: "warehouseName", label: "WareHouse Name", minWidth: 170 },
  { id: "shelves", label: "No. of shelves", minWidth: 100, arrayLength: true },
  {
    id: "users",
    label: "No. of Employees",
    minWidth: 170,
    arrayLength: true,
  },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
  },
  {
    id: "settings",
    label: "Settings",
    minWidth: 100,
    align: "center",
    format: (value, row, handleWarehouseModel) => (
      <IconButton
        onClick={() => handleWarehouseModel(row)}
        aria-label="settings"
      >
        <SettingsIcon color="primary" fontSize="small" />
      </IconButton>
    ),
  },
];

export default function WareHouseTable() {
  const {
    user,
    messageApi,
    privileges,
    isAdmin,
    warehouses: warehousesContext,
    setWarehouses: setWarehousesContext,
  } = React.useContext(MyContext);
  // console.log(user);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [warehouses, setWarehouses] = React.useState(warehousesContext);
  const router = useRouter();
  const [warehouseClicked, setWarehouseClicked] = React.useState("");
  // console.log(user);
  // console.log(warehouses);
  const [warehouseEditModel, setWarehouseEditModel] = React.useState(false);
  function handleWarehouseModel(row) {
    setWarehouseClicked(row);
    setWarehouseEditModel(!warehouseEditModel);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  async function getWarehouses(ids) {
    // console.log(ids);
    setLoading(true);

    const { data } = await axios.post("/api/warehouse/getDetails", {
      ids: ids,
    });
    if (data.status === 200) {
      setWarehouses(data.data);
      setWarehousesContext(data.data);
    } else if (data.status === 500) closeMessage(messageApi, data.msg, "error");
    setLoading(false);
  }
  React.useEffect(() => {
    if (user && (isAdmin || privileges.Add_Warehouse) && !warehouses)
      getWarehouses(user.company.warehouses);
    else if (
      user &&
      // !user.privileges &&
      // !user.privileges.Add_Warehouse &&
      user.warehouse &&
      !warehouses
    )
      getWarehouses(user.warehouse);
  }, [user, warehouses]);

  React.useEffect(() => {
    setWarehouses(warehousesContext);
  }, [warehousesContext]);
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading && !warehouses ? (
          <LinearProgress />
        ) : !warehouses && (isAdmin || privileges.Add_Warehouse) ? (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert style={{ fontSize: "15px" }} severity="info">
              <AlertTitle>
                <b>No Warehouses found!</b>
              </AlertTitle>
              You can start by registering a new warehouse by clicking register
              button.
              <br />
              <br />
              <Link href="/admin/add_warehouse">
                <Button
                  //   href="/admin/add_warehouse"
                  variant="contained"
                  color="success"
                >
                  Register
                </Button>
              </Link>
            </Alert>
          </Stack>
        ) : !warehouses && (isAdmin || !privileges.Add_Warehouse) ? (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert style={{ fontSize: "15px" }} severity="info">
              <AlertTitle>
                <b>No Warehouses found!</b>
              </AlertTitle>
              It seems you are not registered in any warehouse. Feel free to
              contact the company for further details and assistance.
            </Alert>
          </Stack>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader size="small" aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => {
                      if (
                        column.id === "settings" &&
                        !isAdmin &&
                        !privileges.Edit_Warehouse
                      )
                        return null;
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
                  {warehouses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => {
                      return (
                        <TableRow
                          className="pointer"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={idx}
                        >
                          {columns.map((column) => {
                            let value;
                            if (column.arrayLength)
                              value = row[column.id].length;
                            else value = row[column.id];
                            if (
                              column.id === "settings" &&
                              !isAdmin &&
                              !privileges.Edit_Warehouse
                            )
                              return null;
                            return (
                              <TableCell
                                onClick={() => {
                                  if (column.id !== "settings") {
                                    router.push(
                                      `/dashboard/warehouses/${row._id}`
                                    );
                                  }
                                }}
                                key={column.id}
                                align={column.align}
                              >
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : column.format &&
                                    typeof column.format === "function"
                                  ? column.format(
                                      value,
                                      row,
                                      handleWarehouseModel
                                    )
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              // rowsPerPageOptions={[10, 25, 100]}
              rowsPerPageOptions={[]}
              component="div"
              count={warehouses ? warehouses.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      <EditWarehouseModel
        setWarehouseEditModel={setWarehouseEditModel}
        warehouseEditModel={warehouseEditModel}
        warehouseClicked={warehouseClicked}
      />
    </>
  );
}
