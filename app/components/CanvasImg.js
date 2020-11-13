import React, { useState, useRef, useEffect } from "react";
import { Button, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const loadImage = url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`load ${url} fail`));
    img.src = url;
  });
};

function CanvasImg({ image, name, namePos, initialSize, pos, addURL }) {
  const canvasRef = useRef();
  const parentRef = useRef();
  const [size, setSize] = useState(initialSize);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [imageURL, setImageURL] = useState("");
  useEffect(() => {
    async function draw() {
      const ctx = canvasRef.current.getContext("2d");
      ctx.save();
      const bgImg = await loadImage(image);
      const rel = bgImg.height / bgImg.width;
      // const width = parentRef.current.offsetWidth - 30;
      // const height = Math.floor(rel * width);
      const heightMin = 270 * rel;
      // setSize({
      //   width,
      //   height
      // });
      // ctx.restore();
      ctx.clearRect(0, 0, size.width, size.height);

      ctx.shadowColor = "black";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#fefefe";
      ctx.fillRect(20, 20, 310, 350);
      ctx.shadowColor = "transparent";
      // ctx.restore();
      ctx.drawImage(
        bgImg,
        0,
        0,
        bgImg.height,
        bgImg.height,
        40,
        40,
        270,
        heightMin
      );
      // ctx.drawImage(bgImg, 0, 0, width, height, 30, 30, 280, heightMin);
      // ctx.drawImage(bgImg, 30, 30, width, height);
      // ctx.save();
      // ctx.restore();
      setTimeout(() => {
        // ctx.restore();
        ctx.font = `${namePos.fontSize}pt Nunito`;

        // ctx.fillStyle = "white";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const nextRot = (+namePos.rotName * Math.PI) / 180;

        ctx.rotate(nextRot);

        ctx.fillText(name, +namePos.nameX, +namePos.nameY);
        ctx.rotate(-nextRot);
        const result = canvasRef.current.toDataURL();
        setImageURL(result);
        addURL(result, pos);
        setHasDrawn(false);
        // ctx.fillText(name, size.width / 2, size.height / 2);
      }, 100);

      // const canvas1 = document.createElement("canvas");
      // const ctxText = canvas1.getContext("2d");
      // canvas1.width = width;
      // canvas1.height = height;
      //
      // const imgData = canvas1.toDataURL();
      // const nextImg = new Image();
      // nextImg.onload = () => {
      //   ctx.drawImage(nextImg, 0, 0, width, height);
      // };
      // nextImg.src = imgData;
    }
    if (
      !!canvasRef.current &&
      !!parentRef.current &&
      name &&
      image &&
      !hasDrawn
    ) {
      draw();
      setHasDrawn(true);
    }
  }, [image, canvasRef.current, parentRef.current, name, namePos]);

  const resetPaint = () => {
    if (hasDrawn) {
      setHasDrawn(false);
    }
  };
  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext("2d");
  //     ctx.font = "24pt Nunito";
  //     ctx.fillStyle = "white";
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";
  //     ctx.rotate(Math.PI / 2);
  //     ctx.fillText(name, size.width / 2, size.height / 2);
  //   }
  // }, [canvasRef, name]);

  return (
    <div
      style={{ minHeight: `${size.height}px` }}
      className="col-6 abs_cont"
      ref={parentRef}
    >
      <div className="refresh_render">
        <Row>
          <Col>
            {" "}
            <Button color="link" onClick={resetPaint}>
              <FontAwesomeIcon icon="redo" />
            </Button>
          </Col>
          <Col>
            <Button
              tag="a"
              download={`${name}.png`}
              href={imageURL}
              color="link"
              onClick={resetPaint}
            >
              <FontAwesomeIcon icon="download" />
            </Button>
          </Col>
        </Row>
      </div>
      <canvas
        id={name}
        width={size.width}
        height={size.height}
        ref={canvasRef}
      />
    </div>
  );
}

export default CanvasImg;
