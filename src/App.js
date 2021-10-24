import React, { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { Rnd } from "react-rnd";
import PDF from "@mikecousins/react-pdf";
import { isEmpty } from "lodash";
import {
  FaArrowLeft,
  FaAngleLeft,
  FaAngleRight,
  FaDownload,
} from "react-icons/fa";

import "./App.css";
import submit, { TextFile } from "./submit";

const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "dashed 2px #ff7d05",
  backgroundColor: "rgb(255 , 193 , 7 ,0.5 )",
};

function App() {
  const [numPage, setnumPage] = useState(0);
  const [Pdf, setPdf] = useState(null);
  const [signer, setSigner] = useState(null);
  const [page, setPage] = useState(1);
  const [position, setPosition] = useState({
    x: 100,
    y: 100,
  });
  const [size, setSize] = useState({
    width: 200,
    height: 200,
  });
  const [colorPad, setColorPad] = useState("black");
  const [fileName, setFileName] = useState("");
  const [buffer, setBuffer] = useState(null);
  const canvesRef = useRef();

  const setFile = (file) => {
    let readFile = new FileReader();
    readFile.readAsDataURL(file);
    readFile.onloadend = (e) => {
      setPdf(e.target.result);
    };
  };

  const AlertErr = () => {
    alert("Pdf Error!");
    setPdf(null);
  };

  const setNewPdf = async (promise) => {
    setPosition({
      x: 100,
      y: 100,
    });
    const result = await promise;
    setBuffer(result);
    const base64 = Buffer.from(result).toString("base64");
    setPdf(`data:application/pdf;base64,${base64}`);
  };

  return (
    <div className="Container">
      {Pdf ? (
        <>
          <div className="d-flex justify-content-between">
            <button className="btnContainer" onClick={() => setPdf(null)}>
              <FaArrowLeft color="white" size="20" />
            </button>
            <div className="d-flex">
              <Button
                variant="warning"
                className="btn"
                onClick={() =>
                  setNewPdf(submit(Pdf, signer, page, position, size))
                }
              >
                Save
              </Button>

              <Form.Control
                type="text"
                placeholder="Enter Filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="input"
              />
              <Button
                variant="warning"
                className="btn"
                onClick={() => TextFile(buffer, fileName)}
                disabled={isEmpty(fileName) || isEmpty(buffer)}
              >
                <FaDownload />
              </Button>
            </div>
          </div>
          <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.x, y: position.y }}
            minWidth={100}
            minHeight={100}
            onResize={(e, direction, ref, delta) => {
              setSize({
                width: ref.style.width,
                height: ref.style.height,
              });
            }}
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            style={styles}
          >
            <img
              src={signer}
              alt="signer"
              style={{ width: size.width, height: size.height }}
            />
          </Rnd>
          <div className="PdfContainer m-3 ">
            <button
              className="btnContainer"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              <FaAngleLeft
                color={page <= 1 ? "light grey" : "white"}
                size="40"
              />
            </button>
            <PDF
              file={Pdf}
              page={page}
              scale={1.0}
              className="pdfView"
              cMapPacked={true}
              onDocumentLoadSuccess={(e) => setnumPage(e._pdfInfo.numPages)}
              onDocumentLoadFail={() => AlertErr()}
            />

            <button
              className="btnContainer"
              onClick={() => setPage(page + 1)}
              disabled={page >= numPage}
            >
              <FaAngleRight color="white" size="40" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="headerLabel">Add Signature to PDF</div>
          <div className="mt-4 signSection">
            <div>
              <h3 className="text-white"> Enter Your Signature </h3>
              <div>
                <Form.Label className="text-white"> Pen Color</Form.Label>
                <Form.Control
                  type="color"
                  id="exampleColorInput"
                  defaultValue={colorPad}
                  title="Choose your color"
                  onChange={(value) => {
                    canvesRef.current.clear();
                    setColorPad(value.target.value);
                  }}
                />
              </div>
            </div>
            <Card>
              <SignatureCanvas
                penColor={colorPad}
                ref={canvesRef}
                canvasProps={{
                  width: 300,
                  height: 280,
                  className: "sigCanvas",
                }}
              />
            </Card>

            <Button
              variant="warning"
              className="btn"
              onClick={() => setSigner(canvesRef.current.toDataURL())}
            >
              Save
            </Button>
            <Button
              variant="warning"
              className="btn"
              onClick={() => {
                canvesRef.current.clear();
                setSigner(null);
              }}
            >
              Clean
            </Button>

            <Form.Group controlId="formFile" className="mt-3">
              <h3 className="text-white"> Enter Your Signature </h3>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={isEmpty(signer)}
                accept="application/pdf"
                className="w500"
              />
            </Form.Group>
            {isEmpty(signer) && (
              <span className="text-white">
                * please first save the Signature
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
