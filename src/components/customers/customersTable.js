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
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { AlertTitle, Button, IconButton, LinearProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SettingsIcon from "@mui/icons-material/Settings";
import CustomerMenuModel from "./customerMenuModel";

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
  { id: "name", label: "Customer Name", minWidth: 170 },
  {
    id: "customerType",
    label: "Customer Type",
    minWidth: 100,
    arrayLength: true,
  },
  {
    id: "mobileNo",
    label: "Mobile Number",
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
    format: (row, handleCustomerModel) => (
      <IconButton
        onClick={() => handleCustomerModel(row)}
        aria-label="settings"
      >
        <SettingsIcon color="primary" fontSize="small" />
      </IconButton>
    ),
  },
];

export default function CustomersTable() {
  const { user, messageApi, privileges, isAdmin } = React.useContext(MyContext);
  //   console.log(user);
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [customers, setCustomers] = React.useState(null);
  const [customerClicked, setCustomerClicked] = React.useState(null);
  const [customerModel, setCustomerModel] = React.useState(false);
  // console.log(customers);
  //   const router = useRouter();
  //   const [warehouseClicked, setWarehouseClicked] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  async function getCustomers() {
    // console.log(ids);
    setLoading(true);

    const { data } = await axios.post("/api/customer", {
      company: user.company._id,
    });
    if (data.status === 200) setCustomers(data.data);
    else if (data.status === 500) closeMessage(messageApi, data.msg, "error");
    setLoading(false);
  }

  React.useEffect(() => {
    if (user && (isAdmin || privileges.View_Customer) && !customers)
      getCustomers();
  }, [user, customers]);

  function handleCustomerModel(row) {
    if (isAdmin || privileges.Add_Customer) {
      setCustomerClicked(row);
      setCustomerModel(true);
    }
  }

  // Filter columns based on privilege.Add_Customer
  const filteredColumns =
    isAdmin || privileges.Add_Customer
      ? columns
      : columns.filter((column) => column.id !== "settings");
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading && !customers ? (
          <LinearProgress />
        ) : !customers || customers.length === 0 ? (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert style={{ fontSize: "15px" }} severity="info">
              <AlertTitle>
                <b>No Customers found!</b>
              </AlertTitle>
              You can register a customer by clicking register button.
              <br />
              <br />
              <Link href="/dashboard/customer/add">
                <Button variant="contained" color="success">
                  Register
                </Button>
              </Link>
            </Alert>
          </Stack>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {filteredColumns.map((column) => {
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
                  {customers
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
                          {filteredColumns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                onClick={() => {
                                  if (column.id !== "settings") {
                                    (isAdmin ||
                                      privileges.Customer_Analytics) &&
                                      router.push(
                                        `/dashboard/customer/${row._id}`
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
                                  ? column.format(row, handleCustomerModel)
                                  : value
                                  ? value
                                  : "-"}
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
              count={customers ? customers.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      <CustomerMenuModel
        setCustomerModel={setCustomerModel}
        customerModel={customerModel}
        customerClicked={customerClicked}
        setCustomerClicked={setCustomerClicked}
        customers={customers}
        setCustomers={setCustomers}
      />
    </>
  );
}
