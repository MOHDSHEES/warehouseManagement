import React, { useState, useEffect, useRef, useCallback } from "react";
import { QrReader } from "react-qr-reader";
import Box from "@mui/material/Box";

const QRCodeScanner = ({ isOpen, onClose, setScanData, searchShelf }) => {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null); // Reference for canvas context

  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScannerEnabled(true);
    } else {
      setScanData("");
      setScannerEnabled(false);
      stopMediaStream();
    }

    return () => {
      stopMediaStream(); // Ensure scanner is disabled when component unmounts
    };
  }, [isOpen, setScanData, stopMediaStream]);

  const handleError = (err) => {
    console.error(err);
  };

  const handleOverlayClick = () => {
    setScannerEnabled(false);
    stopMediaStream();
    onClose(); // Close the scanner when overlay is clicked
  };

  const handleResult = (result) => {
    if (result) {
      setScanData(result.text);
      searchShelf(result.text);
      setScannerEnabled(false); // Disable scanner when result is obtained
      stopMediaStream();
      onClose(); // Close scanner
    }
  };

  const handleLoad = (stream) => {
    streamRef.current = stream;
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      contextRef.current = context; // Store the canvas context
    }
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
    display: isOpen && scannerEnabled ? "block" : "none",
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
    pointerEvents: isOpen && scannerEnabled ? "auto" : "none",
  };

  const scannerStyle = {
    width: "300px",
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
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <QrReader
              delay={300}
              onError={handleError}
              onResult={handleResult}
              onLoad={handleLoad}
              constraints={{ facingMode: "environment" }}
              style={{ width: "100%" }}
              videoId="qr-reader-video"
            />
          </div>
        )}
      </Box>
    </>
  );
};

export default QRCodeScanner;
