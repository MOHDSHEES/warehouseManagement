import React, { useContext } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Unstable_Grid2 as Grid,
  styled,
  Divider,
  Chip,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { MyContext } from "../../context";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#a6b0c3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const InvoiceTemplate = ({ invoiceData }) => {
  const { user } = useContext(MyContext);
  const { party, order, payment } = invoiceData;
  return (
    <div className="page-content container" id="invoice">
      <div className="container px-0">
        <div className="row mt-4">
          <div className="col-12 col-lg-12">
            <div className="row">
              <div className="col-12">
                <div className="text-center text-150">
                  <Typography
                    className="text-default-d3"
                    variant="h5"
                    gutterBottom
                  >
                    {user.company.companyName}
                  </Typography>
                </div>
              </div>
            </div>
            {/* .row */}
            <Divider variant="middle" flexItem sx={{ mt: 3, mb: 7 }} />
            <Grid container spacing={2} className="mt-1 mb-3">
              <Grid xs={12} sm={8}>
                <Typography variant="subtitle2" gutterBottom>
                  Bill To:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {party.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {party.address}
                </Typography>
                {party.mobileNo && (
                  <Typography variant="body2" gutterBottom>
                    {party.mobileNo}
                  </Typography>
                )}
                {party.email && (
                  <Typography variant="body2" gutterBottom>
                    {party.email}
                  </Typography>
                )}
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Invoice:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Id: {invoiceData.orderId}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Date: {invoiceData.createdAt.substring(0, 10)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Status:{" "}
                  {!payment.payingAmount ? (
                    <b style={{ color: "red" }}>Not Paid</b>
                  ) : (
                    <b
                      style={{
                        color:
                          parseFloat(payment.payingAmount).toFixed(2) ===
                          parseFloat(payment.totalPrice).toFixed(2)
                            ? "green"
                            : "blue",
                      }}
                    >
                      {"Paid- " + payment.payingAmount}
                    </b>
                  )}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  Payment Method: {payment.paymentMethod}
                </Typography>
                {payment.paymentMethod === "Online" && payment.paymentId && (
                  <Typography variant="body2" gutterBottom>
                    Payment Id: {payment.paymentId}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <TableContainer sx={{ mt: 7 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 150 }}>
                      Product Name
                    </StyledTableCell>
                    <StyledTableCell align="right">Id</StyledTableCell>
                    {/* <StyledTableCell align="right">Variant</StyledTableCell> */}
                    <StyledTableCell align="right">Qty</StyledTableCell>
                    <StyledTableCell align="right">Price</StyledTableCell>
                    <StyledTableCell align="right">Discount</StyledTableCell>
                    <StyledTableCell align="right">Total Price</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {rows.map((row) => ( */}
                  {order.map((item, idx) => {
                    return (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {idx + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item.productName}
                        </TableCell>
                        <TableCell align="right">{item.productId}</TableCell>
                        {/* <TableCell align="right">color:red,size:-</TableCell> */}
                        <TableCell align="right">
                          {item.orderData.qty}
                        </TableCell>
                        <TableCell align="right">
                          {item.orderData.price}
                        </TableCell>
                        <TableCell align="right">
                          {item.orderData.discount}%
                        </TableCell>
                        <TableCell align="right">
                          {parseInt(item.orderData.qty) *
                            parseFloat(item.orderData.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {/* <TableCell rowSpan={3} align="center" /> */}
                    <TableCell align="right" sx={{ py: 3 }} colSpan={6}>
                      <b>Total</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>{payment.totalPrice}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {/* <div class="table-responsive">
                <table class="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                  <thead class="bg-none bgc-default-tp1">
                    <tr class="text-white">
                      <th class="opacity-2">#</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th width="140">Amount</th>
                    </tr>
                  </thead>

                  <tbody class="text-95 text-secondary-d3">
                    <tr></tr>
                    <tr>
                      <td>1</td>
                      <td>Domain registration</td>
                      <td>2</td>
                      <td class="text-95">$10</td>
                      <td class="text-secondary-d2">$20</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
