import JsBarcode from "jsbarcode";

const generateAndDownloadBarcode = async (id) => {
  try {
    if (!id) {
      throw new Error("Invalid ID for generating barcode.");
    }

    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 800; // Adjust as needed
    canvas.height = 600; // Adjust as needed

    // Generate barcode on canvas
    await JsBarcode(canvas, id, {
      format: "CODE128",
      displayValue: true,
    });

    // Convert canvas to data URL (PNG format)
    const dataUrl = canvas.toDataURL("image/png");

    // Create download link and trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "barcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error generating and downloading barcode:", error);
  }
};

export default generateAndDownloadBarcode;
