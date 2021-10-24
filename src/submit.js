import { PDFDocument } from "pdf-lib";

export const TextFile = (data, fileName) => {
  const element = document.createElement("a");
  const file = new Blob([data], { type: "application/pdf" });
  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.pdf`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

const submit = async (Pdf, sign, Page, position, size, fileName) => {
  const testDiv = document.getElementsByClassName("pdfView");
  const pdfDoc = await PDFDocument.load(Pdf);
  const pngImage = await pdfDoc.embedPng(sign);
  const pages = pdfDoc.getPages();
  const firstPage = pages[Page - 1];
  const { height } = firstPage.getSize();
  const widthSize = parseInt(size.width);
  const heightSize = parseInt(size.height);
  firstPage.drawImage(pngImage, {
    x: position.x - testDiv[0].offsetLeft,
    y: height - heightSize - (position.y - 50),
    height: heightSize,
    width: widthSize,
  });
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default submit;
