import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader"; // Import QrReader as named import
import Box from "@mui/material/Box";

const QRCodeScanner = ({ isOpen, onClose, onScan }) => {
  const [scanResult, setScanResult] = useState("");
  const [scannerEnabled, setScannerEnabled] = useState(false);
  let flag = 1;
  useEffect(() => {
    if (isOpen) {
      if (flag) {
        flag = 0;
        setScannerEnabled(true);
      } // Enable scanner when isOpen changes to true
    } else {
      setScanResult(""); // Clear scan result when scanner is closed
      setScannerEnabled(false); // Disable scanner when isOpen changes to false
    }
  }, [isOpen]);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      console.log(data);
      onScan(data);
    }
  };

  const handleError = (err) => {
    console.error("QR Code Scanner Error:", err);
  };

  const handleOverlayClick = () => {
    onClose(); // Close the scanner when overlay is clicked
  };

  const blackOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 9998,
    cursor: "pointer",
    display: isOpen && scannerEnabled ? "block" : "none", // Display overlay when scanner is open
  };

  const scannerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 9999,
    pointerEvents: isOpen && scannerEnabled ? "auto" : "none", // Allow pointer events when scanner is open
  };

  const scannerStyle = {
    width: "300px", // Adjust width for visibility
    height: "300px",
    border: "2px solid #fff",
    borderRadius: "5px",
    backgroundColor: "rgba(0, 0, 0, 0)",
  };

  return (
    <>
      <div style={blackOverlayStyle} />
      <Box sx={scannerContainerStyle} onClick={handleOverlayClick}>
        {isOpen && scannerEnabled && (
          <div style={scannerStyle}>
            <QrReader
              delay={300}
              onError={handleError}
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              constraints={{ facingMode: "environment" }}
              // onScan={handleScan}
              style={{ width: "100%" }}
            />
            <p>{scanResult}</p>
          </div>
        )}
      </Box>
    </>
  );
};

export default QRCodeScanner;
