import React, { useState } from "react";
import { Form, FormGroup, Input, Label, CustomInput } from "reactstrap"; // import

function FormImage({ setFile, setNames }) {
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
  const handleDrop = e => {
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
    </Form>
  );
}

export default FormImage;
