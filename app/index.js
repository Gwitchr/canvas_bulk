import React, { useState } from "react";
import ReactDom from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Row, Col, Container, Button } from "reactstrap";
import { FormImage, CanvasImg } from "./components";
import { fontawesomeIcons } from "./config/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

library.add(...fontawesomeIcons);

function App() {
  const [canvImage, setCanvImage] = useState(false);
  const [names, setNames] = useState(false);
  const [render, setRender] = useState(false);
  const toggleGenerate = () => {
    setRender(!render);
  };
  const handleGenerate = val => {
    setNames(val);
  };
  return (
    <Container tag="main" className="container">
      <Row>
        <Col>
          <h1>Whale 🐋, Hello there</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormImage setFile={setCanvImage} setNames={handleGenerate} />
        </Col>
      </Row>
      <Row className="justify-content-center my-5">
        <Col className="text-center">
          <Button color="primary" onClick={toggleGenerate}>
            Generar <FontAwesomeIcon icon={render ? "times" : "check"} />
          </Button>
        </Col>
      </Row>
      <Row>
        {names.length > 0 &&
          render &&
          names.map((name, i) => (
            <CanvasImg key={i} image={canvImage} name={name} />
          ))}
      </Row>
    </Container>
  );
}

ReactDom.render(<App />, document.getElementById("app"));
