import "regenerator-runtime/runtime";
import React, { useState } from "react";
import ReactDom from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Row, Col, Container, Button } from "reactstrap";
import { FormImage, CanvasImg } from "./components";
import { fontawesomeIcons } from "./config/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import { INamePos } from "./types";

library.add(...fontawesomeIcons);

function App(): JSX.Element {
  const [canvImage, setCanvImage] = useState<string | ArrayBuffer | null>(null);
  const [names, setNames] = useState<string[] | null>(null);
  const [render, setRender] = useState<boolean>(false);
  const [namePos, setNamePos] = useState<INamePos>({
    nameX: 200,
    nameY: 200,
    rotName: -4,
    fontSize: 24
  });
  const initialSize = { width: 350, height: 400, rotate: 90, fontSize: 60 };
  const [allDownload, setAllDownload] = useState(false);
  const toggleGenerate = () => {
    setRender(!render);
  };
  const handleGenerate = (val: string[]) => {
    setNames(val);
  };
  const handleSetNamePos = ({ target: { name, value } }) => {
    setNamePos({ ...namePos, [name]: value });
  };
  const handleDownloadAll = () => {
    setAllDownload(true);
    setTimeout(() => setAllDownload(false), 1000);
  };

  // const handleDownloadAll = () => {
  //   allURL.forEach((url, i) => {
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.style = "display: none";
  //
  //     a.href = url;
  //     a.download = `${names[i]}.png`;
  //     a.click();
  //     document.body.removeChild(a);
  //   });
  // };
  return (
    <Container tag="main" className="container">
      <Row>
        <Col>
          <h1>Whale 🐋, Hello there</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormImage
            initialSize={initialSize}
            namePos={namePos}
            setNamePos={handleSetNamePos}
            setFile={setCanvImage}
            setNames={handleGenerate}
          />
        </Col>
      </Row>
      <Row className="justify-content-center my-5 text-center">
        <Col className="text-center">
          <Button color="primary" onClick={toggleGenerate}>
            Generar <FontAwesomeIcon icon={render ? "times" : "check"} />
          </Button>
        </Col>
        <Col>
          {render && (
            <Button color="primary" onClick={handleDownloadAll}>
              Descargar todo <FontAwesomeIcon icon="download" />
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        {names &&
          names.length > 0 &&
          render &&
          names.map((name, i) => (
            <CanvasImg
              initialSize={initialSize}
              namePos={namePos}
              allDownload={allDownload}
              key={i}
              image={canvImage}
              name={name}
            />
          ))}
      </Row>
    </Container>
  );
}

ReactDom.render(<App />, document.getElementById("app"));
