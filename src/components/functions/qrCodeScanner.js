import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader"; // Import QrReader as named import
import Box from "@mui/material/Box";

const QRCodeScanner = ({ isOpen, onClose, setScanData, searchShelf }) => {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const flagRef = useRef(1);

  useEffect(() => {
    if (isOpen) {
      if (flagRef.current) {
        flagRef.current = 0;
        setScannerEnabled(true);
      }
    } else {
      setScanData("");
      setScannerEnabled(false);
      flagRef.current = 1;
    }

    return () => {
      setScannerEnabled(false); // Ensure scanner is disabled when component unmounts
    };
  }, [isOpen, setScanData]);

  useEffect(() => {
    return () => {
      // Perform any necessary cleanup here
      setScannerEnabled(false);
    };
  }, []);

  const handleError = (err) => {
    console.log(err);
    // closeMessage(messageApi, err, "error");
    // onClose();
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
              onResult={(result, error = null) => {
                if (!!result) {
                  setScanData(result.text);
                  searchShelf(result.text);
                  setScannerEnabled(false); // Disable scanner when result is obtained
                  onClose(); // Close scanner
                }

                if (!!error) {
                  console.error(error);
                }
              }}
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
