import JsBarcode from "jsbarcode";

export default function generateAndDownloadBarcode(barcodeValue) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Define canvas dimensions
  const canvasWidth = 600; // Width of the canvas
  const canvasHeight = 300; // Height of the canvas

  // Set canvas dimensions
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Set background to white
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw barcode
  JsBarcode(canvas, barcodeValue, {
    format: "CODE128",
    width: 4, // Increase width for larger barcode
    height: 150, // Increase height for larger barcode
    margin: 20, // Adjust margin if needed
  });

  // Convert canvas to PNG and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "barcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  }, "image/png");
}
