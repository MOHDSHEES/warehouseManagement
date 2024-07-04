import React, { useState, useEffect, useContext } from "react";
import { QrReader } from "react-qr-reader"; // Import QrReader as named import
import Box from "@mui/material/Box";
// import { closeMessage } from "./message";
// import { MyContext } from "../context";

const QRCodeScanner = ({ isOpen, onClose, setScanData }) => {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  // const { messageApi } = useContext(MyContext);

  // useEffect(() => {
  //   const handleWindowBack = (event) => {
  //     if (isOpen && scannerEnabled) {
  //       event.preventDefault(); // Prevent default behavior of browser back button
  //       event.stopPropagation(); // Stop propagation to the previous URL
  //       onClose(); // Close the scanner
  //       // Push a state object with a unique identifier to manage browser history
  //       window.history.pushState(
  //         { scannerClosed: true },
  //         "",
  //         window.location.href
  //       );
  //     }
  //   };

  //   // console.log("inside");

  //   // Initialize the history state with a unique identifier
  //   // window.history.pushState({ initial: true }, "", window.location.href);
  //   window.addEventListener("popstate", handleWindowBack);

  //   return () => {
  //     window.removeEventListener("popstate", handleWindowBack);
  //   };
  // }, [isOpen, scannerEnabled, onClose]);

  let flag = 1;
  useEffect(() => {
    if (isOpen) {
      if (flag) {
        flag = 0;
        setScannerEnabled(true);
      } // Enable scanner when isOpen changes to true
    } else {
      setScanData(""); // Clear scan result when scanner is closed
      setScannerEnabled(false); // Disable scanner when isOpen changes to false
    }
  }, [isOpen]);

  // const handleScan = (data) => {
  //   if (data) {
  //     setScanResult(data);
  //     console.log(data);
  //     onScan(data);
  //   }
  // };

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
                  setScanData(result);
                  onClose();
                  // console.log(result);
                  // setData(result?.text);
                }

                if (!!error) {
                  // closeMessage(messageApi, error, "error");
                  // console.log("in");
                  // console.log(error);
                  // onClose();
                  // console.info(error);
                }
              }}
              constraints={{ facingMode: "environment" }}
              // onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </Box>
    </>
  );
};

export default QRCodeScanner;
