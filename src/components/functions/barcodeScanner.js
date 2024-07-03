import React, { useContext, useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import Box from "@mui/material/Box";
import { closeMessage } from "./message";
import { MyContext } from "../context";

const BarcodeScanner = ({ onDetected, open, onClose }) => {
  const { messageApi } = useContext(MyContext);
  const scannerRef = useRef(null);
  const [scannerActive, setScannerActive] = useState(false);

  let f = 1;
  useEffect(() => {
    let scannerInitialized = false;

    const initializeQuagga = () => {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 300,
              height: 300,
              facingMode: "environment", // or 'user' for front camera
            },
            area: {
              // defines rectangle of the detection/localization area
              top: "0%", // top offset
              right: "0%", // right offset
              left: "0%", // left offset
              bottom: "0%", // bottom offset
            },
          },
          decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
          },
        },
        (err) => {
          if (err) {
            // console.error("Error initializing Quagga:", err);
            return;
          }
          Quagga.start();
          scannerInitialized = true;
          setScannerActive(true);
        }
      );

      Quagga.onDetected(handleDetected);

      return () => {
        if (scannerInitialized) {
          Quagga.offDetected(handleDetected);
          Quagga.stop();
          //   releaseCameraResources();
        }
        setScannerActive(false);
      };
    };

    if (open && !scannerActive && f) {
      f = 0;
      initializeQuagga();
    }

    // Cleanup on unmount
    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
      //   releaseCameraResources();
      setScannerActive(false);
    };
  }, [open]); // Only re-run effect if `open` changes

  const handleDetected = (result) => {
    onDetected(result.codeResult.code);
    closeMessage(messageApi, result.coderResult.code);
    console.log(result);
  };

  //   const releaseCameraResources = () => {
  //     const videoElement = scannerRef.current?.querySelector("video");
  //     if (videoElement) {
  //       const stream = videoElement.srcObject;
  //       if (stream) {
  //         const tracks = stream.getTracks();
  //         tracks.forEach((track) => {
  //           track.stop();
  //         });
  //         videoElement.srcObject = null;
  //         console.log("Camera resources released");
  //       }
  //     }
  //   };

  const handleOverlayClick = () => {
    if (scannerActive) {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
      //   releaseCameraResources();
      setScannerActive(false);
      onClose(); // Call onClose after stopping Quagga and releasing resources
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
  };

  const scannerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Center horizontally and vertically
    height: "310px",
    width: "310px", // Adjust width for visibility
    border: "2px solid #fff",
    borderRadius: "5px",
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 9999,
    // overflow: "hidden",
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div style={blackOverlayStyle} onClick={handleOverlayClick} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div ref={scannerRef} style={scannerStyle} />
      </Box>
    </>
  );
};

export default BarcodeScanner;
