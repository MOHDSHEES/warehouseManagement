import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as XLSX from "xlsx";
import { MyContext } from "../context";
import axios from "axios";
import { closeMessage, openMessage } from "../functions/message";
import { Box, Stack, Typography } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
import downloadExcel from "../functions/excelDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

export default function UploadFromExcel({ open, setOpen, warehouse }) {
  const { user, messageApi } = useContext(MyContext);
  const [excelData, setExcelData] = useState(null);
  const [formatedData, setFormatedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [chunk, setChunk] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const formatedData = data.slice(1).map((row) => {
        const productName = row[1];
        const productId = row[0];
        const retailPrice = parseFloat(row[2]);
        const wholesalePrice = (retailPrice / 2).toFixed(2); // Calculate wholesalePrice as half of retailPrice
        return {
          productName: productName,
          productId: productId.toUpperCase(),
          retailPrice: parseFloat(retailPrice),
          wholesalePrice: parseFloat(wholesalePrice),
          company: user.company._id,
          warehouse: warehouse,
          quantity: 1,
        };
      });

      //   console.log(formatedData);
      setFormatedData(formatedData.slice(0, 2000));
      setExcelData(data);
    };

    reader.readAsArrayBuffer(file);
    // reader.readAsBinaryString(file);
  };
  const handleClose = () => {
    setExcelData(null);
    setFormatedData(null);
    setLoading(false);
    setStatus([]);
    setChunk(null);
    setOpen(false);
  };
  const handleSubmit = async () => {
    // console.log("in");
    // console.log("formatedData: ", formatedData);
    try {
      if (formatedData && formatedData.length > 0) {
        setLoading(true);
        openMessage(messageApi, "Saving...");

        const chunkSize = 100;
        for (let i = 0; i < formatedData.length; i += chunkSize) {
          setChunk(i + 1);
          const chunk = formatedData.slice(i, i + chunkSize);
          // console.log("chunk: ", chunk);
          const { data } = await axios.post("/api/product/addBulk", {
            products: chunk,
            warehouse: warehouse,
          });
          if (data.status === 200) {
            setStatus((preValue) => [...preValue, ...data.statuses]);
          } else {
            closeMessage(messageApi, data.statuses[0].status, "error");
            setStatus((preValue) => [...preValue, ...data.statuses]);
            setLoading(false);
            return; // Exit loop on error
          }
        }
        setStatus((preValue) => [
          ...preValue,
          { productId: "-", status: "All products uploaded." },
        ]);
        closeMessage(messageApi, "Products Added Successfully", "success");
        // console.log("All products uploaded");
      }
    } catch (error) {
      closeMessage(messageApi, error, "error");
    } finally {
      setLoading(false);
    }
  };

  function downloadExcelFile() {
    // const formatedStatus = status.map((item) => [item.productId, item.status]);
    downloadExcel(status, "Upload_Statuses", messageApi);
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth="lg"
      open={open}
      //   onClose={handleClose}
      //   disableBackdropClick={true}
    >
      <DialogTitle>Add Products</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Note: You can upload up to 2000 items at once. If more than 2000 items
          are detected, only the first 2000 will be included in the upload.
        </Typography>
        <Typography sx={{ mt: 2 }} variant="body2">
          Total rows found:{" "}
          <b>{excelData && excelData.length ? excelData.length : "-"}</b>
        </Typography>
        {chunk && (
          <Typography variant="body2">
            Progress: Products {(chunk - 1) * 100}-{chunk * 100}
          </Typography>
        )}
        <div>
          <Box sx={{ mt: 3 }}>
            <input
              disabled={loading}
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx, .xls"
            />
          </Box>
          {status && status.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <Stack direction="row" sx={{ mb: 1 }} spacing={2}>
                <h3>Status:</h3>
                <Button
                  size="small"
                  style={{ marginLeft: "auto" }}
                  onClick={downloadExcelFile}
                  variant="outlined"
                  startIcon={
                    <FontAwesomeIcon icon={faFileExport} />
                    //   <FileDownloadIcon />
                  }
                >
                  Download Status
                </Button>
              </Stack>
              <table>
                <thead>
                  <tr>
                    <th style={{ minWidth: "100px" }}>Sr. No</th>
                    <th style={{ minWidth: "130px" }}>Product Id</th>
                    <th>Status</th>
                    {/* {excelData[0].map((header, index) => (
                      <th key={index}>{header}</th>
                    ))} */}
                  </tr>
                </thead>
                <tbody>
                  {status.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1}</td>
                      <td>{row.productId}</td>
                      <td>{row.status}</td>
                      {/* {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))} */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* {excelData && (
            <div style={{ marginTop: "10px" }}>
              <h2>Excel Data:</h2>
              <table>
                <thead>
                  <tr>
                    {excelData[0].map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" disabled={loading} onClick={handleClose}>
          Cancel
        </Button>

        <Button
          // onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
          color="primary"
        >
          Upload and Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
