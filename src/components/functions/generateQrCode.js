import QRCode from "qrcode";

const generateAndDownloadQRCode = (
  id,
  name,
  size = 500,
  margin = 4,
  textPosition = "right"
) => {
  const trimmedName = name.slice(0, 10);
  // Generate QR code as data URL with higher resolution
  QRCode.toDataURL(
    id,
    { errorCorrectionLevel: "H", margin: margin, width: size, height: size },
    (err, qrUrl) => {
      if (err) {
        console.error(err);
        return;
      }

      // Create an image element for the QR code
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous"; // Allow downloading from a different origin
      qrImg.src = qrUrl;

      // When QR code image is loaded, create a canvas and draw QR code and name text on it
      qrImg.onload = () => {
        // Measure text width
        const canvasWidth = calculateCanvasWidth(
          size,
          margin,
          trimmedName,
          textPosition
        );

        // Create the canvas element
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = size; // Height remains the same
        const ctx = canvas.getContext("2d");

        // Draw white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code on canvas
        ctx.drawImage(
          qrImg,
          margin,
          margin,
          size - margin * 2,
          size - margin * 2
        );

        // Set font size and align text
        ctx.font = `bold 300px Arial`; // Keep font size 300px and make the text bold
        ctx.fillStyle = "#000000";
        ctx.textBaseline = "middle"; // Align text vertically centered

        // Calculate text position
        let textX, textY;

        textX = canvas.width - margin - 10; // Text on the right
        textY = canvas.height / 2; // Vertically center text
        ctx.textAlign = "right";

        // Draw name text on canvas
        ctx.fillText(trimmedName, textX, textY);

        // Convert canvas to data URL and create a download link
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${trimmedName}-qrcode.png`;

        // Append download link to body, simulate click, and remove link
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
    }
  );
};

const calculateCanvasWidth = (size, margin, name) => {
  // Measure text width
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.font = `bold 300px Arial`;
  const textMetrics = tempCtx.measureText(name);
  const textWidth = textMetrics.width;

  // Calculate canvas width based on text width and QR code size
  let canvasWidth = size + 2 * margin + textWidth + 20; // Adjusted width to accommodate QR code, margins, and text

  return canvasWidth;
};

export default generateAndDownloadQRCode;
