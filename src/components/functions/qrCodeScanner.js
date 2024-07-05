import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader"; // Import QrReader as named import
import Box from "@mui/material/Box";

const QRCodeScanner = ({ isOpen, onClose, setScanData, searchShelf }) => {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setScannerEnabled(true);
    } else {
      setScanData("");
      setScannerEnabled(false);
    }

    return () => {
      setScannerEnabled(false); // Ensure scanner is disabled when component unmounts
      stopMediaStream();
    };
  }, [isOpen, setScanData]);

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleError = (err) => {
    console.error(err);
    // Additional error handling if needed
  };

  const handleOverlayClick = () => {
    setScannerEnabled(false);
    stopMediaStream();
    onClose(); // Close the scanner when overlay is clicked
  };

  const handleResult = (result) => {
    if (!!result) {
      setScanData(result.text);
      searchShelf(result.text);
      setScannerEnabled(false); // Disable scanner when result is obtained
      stopMediaStream();
      onClose(); // Close scanner
    }
  };

  const handleLoad = (stream) => {
    streamRef.current = stream;
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
      <div style={blackOverlayStyle} onClick={handleOverlayClick} />
      <Box sx={scannerContainerStyle}>
        {isOpen && scannerEnabled && (
          <div style={scannerStyle}>
            <QrReader
              delay={300}
              onError={handleError}
              onResult={handleResult}
              onLoad={(result) => handleLoad(result)}
              constraints={{ facingMode: "environment" }}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </Box>
    </>
  );
};

export default QRCodeScanner;
