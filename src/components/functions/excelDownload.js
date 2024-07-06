import * as XLSX from "xlsx";
import { closeMessage } from "./message";

const downloadExcel = (data, name = "products", messageApi) => {
  try {
    // Step 1: Create a new workbook
    const wb = XLSX.utils.book_new();

    // Step 2: Convert data into a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Step 3: Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, name);

    // Step 4: Generate an Excel file in blob format
    XLSX.writeFile(wb, `${name}.xlsx`);

    // Step 5: Save the file using FileSaver.js
  } catch (error) {
    closeMessage(messageApi, `Error: ${error}`, error);
    console.error("Error downloading Excel:", error);
    // Handle error gracefully
  }
};

export default downloadExcel;
