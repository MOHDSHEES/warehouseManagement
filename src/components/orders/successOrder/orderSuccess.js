import { Alert, Box, Button, CardContent } from "@mui/material";
import React from "react";
import { Card } from "react-bootstrap";
// import generatePDF from "../../functions/generatePdf";
// import InvoiceTemplate from "../selectProducts/invoiceTemplate";

// const handleDownload = async () => {
//   const pdfBlob = await generatePDF();
//   const url = window.URL.createObjectURL(pdfBlob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", "Invoice.pdf"); // Set the desired filename
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

const OrderSuccess = ({ invoiceData, handleReset }) => {
  // console.log(invoiceData);
  return (
    <div>
      <Card sx={{ p: 2, mb: 3 }} className="mt-3">
        <CardContent sx={{ pt: 0 }}>
          <Alert sx={{ mt: 3 }} severity="success">
            Hooray! Order has been successfully placed. Order ID:
            <b>{invoiceData.orderId}</b>
          </Alert>

          {/* <Button sx={{ mt: 3 }} onClick={handleDownload} variant="outlined">
            download Invoice
          </Button> */}
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleReset}>Create More</Button>
      </Box>
      {/* {invoiceData && (
        <Card sx={{ p: 2, mb: 3 }} className="mt-3">
          <InvoiceTemplate invoiceData={invoiceData} />
        </Card>
      )} */}
    </div>
  );
};

export default OrderSuccess;
