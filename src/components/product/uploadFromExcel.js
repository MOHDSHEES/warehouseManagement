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
import { Box } from "@mui/material";

export default function UploadFromExcel({ open, setOpen, warehouse }) {
  const { user, messageApi } = useContext(MyContext);
  const [excelData, setExcelData] = useState(null);
  const [formatedData, setFormatedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const formatedData = data.slice(2).map((row) => {
        const productName = row[1];
        const productId = row[0];
        const retailPrice = parseFloat(row[2]);
        const wholesalePrice = (retailPrice / 2).toFixed(2); // Calculate wholesalePrice as half of retailPrice
        return {
          productName: productName,
          productId: productId,
          retailPrice: parseFloat(retailPrice),
          wholesalePrice: parseFloat(wholesalePrice),
          company: user.company._id,
          warehouse: warehouse,
          quantity: 1,
        };
      });

      //   console.log(formatedData);
      setFormatedData(formatedData.slice(0, 2));
      setExcelData(data);
    };

    reader.readAsBinaryString(file);
  };
  const handleClose = () => {
    setExcelData(null);
    setFormatedData(null);
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (formatedData && formatedData.length > 0) {
        setLoading(true);
        openMessage(messageApi, "Saving...");
        const { data } = await axios.post("/api/product/addBulk", {
          products: formatedData,
        });
        if (data.status === 200) {
          closeMessage(messageApi, "Products Added Successfully", "success");
          console.log("Products uploaded:", data);
        } else closeMessage(messageApi, data.msg, "error");
        // Optionally, you can handle success message or state updates here
      }
    } catch (error) {
      closeMessage(messageApi, error, "error");
      //   console.error("Error uploading products:", error);
      // Handle error state or display error message
    }
    setLoading(false);
  };

  console.log(formatedData);
  return (
    <Dialog fullWidth={true} maxWidth="lg" open={open} onClose={handleClose}>
      <DialogTitle>Add Products</DialogTitle>
      <DialogContent>
        <div>
          <Box>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx, .xls"
            />
          </Box>
          {excelData && (
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
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          // onClick={handleSubmit}
          disabled={loading}
          onClick={handleSubmit}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
