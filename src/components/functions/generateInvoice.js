import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateInvoiceDocument(data, company) {
  const { party, payment, order } = data;
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Add content to the invoice
  doc.setFontSize(20);
  doc.text(company, 105, 20, null, null, "center");

  // Add invoice details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0, 0.9);
  doc.text("Bill To:", 20, 50);
  doc.text(party.name, 20, 60);
  doc.text(party.address, 20, 66);
  if (party && party.mobileNo) doc.text(party.mobileNo, 20, 72);
  if (party && party.email) doc.text(party.email, 20, 78);

  doc.text("Invoice", 140, 50);
  doc.text(`Id: ${data.orderId}`, 140, 60);
  doc.text(`Date: ${data.createdAt.substring(0, 10)}`, 140, 66);
  doc.text(
    `Status: ${
      !payment.payingAmount ? "Not Paid" : "Paid- " + payment.payingAmount
    }`,
    140,
    72
  );
  doc.text(`Payment Method: ${payment.paymentMethod}`, 140, 78);
  if (payment.paymentMethod === "Online" && payment.paymentId)
    doc.text(`Payment Id: ${payment.paymentId}`, 140, 84);

  const tableRows = [];
  order.forEach((row, idx) => {
    tableRows.push([
      idx + 1,
      row.productName,
      row.productId,
      row.orderData.qty,
      row.orderData.price,
      row.orderData.discount,
      calculateTotalPrice(row.orderData.qty, row.orderData.price),
    ]);
    if (row.orderData.comment) {
      tableRows.push([
        {
          content: `Comment: ${row.orderData.comment}`,
          colSpan: 7,
          styles: { fontSize: 9 },
        },
      ]);
    }
  });
  autoTable(doc, {
    head: [
      ["#", "Product Name", "Id", "Qty", "Price", "Discount", "Total Price"],
    ],
    body: tableRows,
    startY: 100,
    columnStyles: {
      0: { cellWidth: 10 },
      2: { cellWidth: 20 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 },
    },
    didDrawPage: function (data) {
      // Footer
      let pageCount = doc.internal.getNumberOfPages();
      let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Page ${pageCurrent} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });
  // [{ content: "Grand Total", styles: { fontStyle: 'bold' } }, calculateGrandTotal()],
  autoTable(doc, {
    body: [
      [
        "Grand Total",
        { content: calculateGrandTotal(), styles: { fontStyle: "bold" } },
      ],
      //   ["VAT", 2],
    ],
    tableWidth: 100,
    margin: {
      left: 95,
    },
    columnStyles: {
      0: { cellWidth: 30 },
    },
  });

  // Function to calculate total price
  function calculateTotalPrice(qty, price) {
    return (parseInt(qty) * parseFloat(price)).toFixed(2);
  }

  // Function to calculate grand total
  function calculateGrandTotal() {
    return order
      .reduce(
        (total, row) =>
          total +
          parseFloat(row.orderData.qty) * parseFloat(row.orderData.price),
        0
      )
      .toFixed(2);
  }

  return doc;
}

export function downloadInvoice(doc, fileName) {
  // Save the PDF
  doc.save(fileName);
}

export function previewInvoice(doc) {
  // Convert PDF to data URI
  const pdfDataUri = doc.output("datauristring");

  // Open the PDF in a new tab
  const newTab = window.open();
  newTab.document.write(
    "<iframe width='100%' height='100%' src='" + pdfDataUri + "'></iframe>"
  );
}
