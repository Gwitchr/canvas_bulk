import React, { useState, DragEvent } from "react";
import { Col, Form, FormGroup, Input, Label, CustomInput } from "reactstrap"; // import

function FormImage({ setFile, setNames, setNamePos, initialSize, namePos }) {
  const [hovered, setHovered] = useState(false);
  const [hasImages, setHasImages] = useState(false);
  const getFiles = ({ target: { files } }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result);
      setHasImages(true);
    };
    reader.readAsDataURL(files[0]);
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      getFiles({ target: { files } });
      e.dataTransfer.clearData();
    }
  };
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormGroup>
        <Label for="canvImage">File Browser</Label>
        <CustomInput
          className={`input_files ${hovered ? "hovered" : ""}`}
          label={hasImages ? "Archivo cargado" : "Escoje un archivo"}
          onChange={getFiles}
          onDrop={handleDrop}
          onDragOver={() => setHovered(true)}
          onDragEnter={() => setHovered(true)}
          onDragLeave={() => setHovered(false)}
          type="file"
          id="canvImage"
          name="canvImage"
        />
      </FormGroup>
      <FormGroup>
        <Label>Nombres para generar imágenes</Label>
        <Input
          type="textarea"
          onChange={({ target: { value } }) => setNames(value.split(","))}
        />
      </FormGroup>
      <FormGroup row>
        <Label sm={2} for="exampleCustomRange">
          Posición nombre{" "}
        </Label>
      </FormGroup>
      <FormGroup className="text-center" row>
        <Col>
          <h3>{`x: ${namePos.nameX}`}</h3>
        </Col>
        <Col>
          <h3>{`y: ${namePos.nameY}`}</h3>
        </Col>
        <Col>
          <h3>{`r: ${namePos.rotName}º`}</h3>
        </Col>
        <Col>
          <h3>{`${namePos.fontSize} pt`}</h3>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col>
          <CustomInput
            onChange={setNamePos}
            min={0}
            max={300}
            type="range"
            id="posNameX"
            name="nameX"
          />
        </Col>
        <Col>
          <CustomInput
            onChange={setNamePos}
            min={0}
            max={initialSize.height}
            type="range"
            id="posNameY"
            name="nameY"
          />
        </Col>
        <Col>
          <CustomInput
            onChange={setNamePos}
            min={-initialSize.rotate}
            max={initialSize.rotate}
            type="range"
            id="rotName"
            name="rotName"
          />
        </Col>
        <Col>
          <CustomInput
            onChange={setNamePos}
            min={0}
            max={initialSize.fontSize}
            type="range"
            id="fontSize"
            name="fontSize"
          />
        </Col>
      </FormGroup>
    </Form>
  );
}

export default FormImage;
