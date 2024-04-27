import html2pdf from "html2pdf.js";

const generatePDF = () => {
  const element = document.getElementById("invoice"); // Replace 'content-to-pdf' with the ID of the HTML element you want to convert

  return new Promise((resolve, reject) => {
    html2pdf()
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        resolve(pdf.output("blob"));
      });
  });
};

export default generatePDF;
