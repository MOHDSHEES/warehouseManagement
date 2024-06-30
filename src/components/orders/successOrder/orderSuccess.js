import { Alert, Box, Button, CardContent, Stack } from "@mui/material";
import React, { useContext, useRef } from "react";
import { Card } from "react-bootstrap";
import generateInvoice, {
  downloadInvoice,
  previewInvoice,
} from "../../functions/generateInvoice";
import { MyContext } from "../../context";
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
  //   const iframeRef = useRef(null);
  const { user } = useContext(MyContext);
  // console.log(invoiceData);

  const handleDownload = () => {
    const doc = generateInvoice(invoiceData, user.company.companyName);
    downloadInvoice(doc, `Invoice(${selectedOrder.orderId}).pdf`);
  };

  const handlePreview = () => {
    const doc = generateInvoice(invoiceData, user.company.companyName);
    previewInvoice(doc);
  };

  return (
    <div>
      <Card sx={{ p: 2, mb: 3 }} className="mt-3">
        <CardContent sx={{ pt: 0 }}>
          <Alert sx={{ mt: 3 }} severity="success">
            Hooray! Order has been successfully placed. Order ID:
            <b>{invoiceData.orderId}</b>
          </Alert>
          <Stack sx={{ mt: 3 }} direction="row" spacing={2}>
            <Button
              //   sx={{ mt: 3 }}
              onClick={
                handleDownload
                //   generateInvoice(invoiceData, user.company.companyName, iframeRef)
              }
              variant="outlined"
            >
              download Invoice
            </Button>
            <Button
              //   sx={{ mt: 3 }}
              onClick={
                handlePreview
                //   generateInvoice(invoiceData, user.company.companyName, iframeRef)
              }
              variant="outlined"
            >
              Preview
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleReset}>Create More</Button>
      </Box>

      {/* <iframe
        ref={iframeRef}
        title="Invoice Preview"
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      ></iframe> */}
      {/* {invoiceData && (
        <Card sx={{ p: 2, mb: 3 }} className="mt-3">
          <InvoiceTemplate invoiceData={invoiceData} />
        </Card>
      )} */}
    </div>
  );
};

export default OrderSuccess;
