import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const loadImage = url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`load ${url} fail`));
    img.src = url;
  });
};

function CanvasImg({ image, name }) {
  const canvasRef = useRef();
  const parentRef = useRef();
  const [size, setSize] = useState({ width: 350, height: 500 });
  useEffect(() => {
    async function draw() {
      const ctx = canvasRef.current.getContext("2d");
      const bgImg = await loadImage(image);
      const rel = bgImg.height / bgImg.width;
      const width = parentRef.current.offsetWidth - 30;
      const height = Math.floor(rel * width);
      setSize({
        width,
        height
      });
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(20, 20, 300, size.height);
      ctx.drawImage(bgImg, 0, 0, width, height, 30, 30, 150, 150);
      // ctx.drawImage(bgImg, 30, 30, width, height);
      ctx.save();
      setTimeout(() => {
        ctx.font = "24pt Nunito";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        // ctx.textBaseline = "middle";
        ctx.rotate(-0.5 * Math.PI);
        ctx.fillText(name, size.width / 2, size.height / 2);
      }, 2000);

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
    if (!!canvasRef.current && !!parentRef.current && name && image) {
      draw();
    }
  }, [image, canvasRef.current, parentRef.current, name]);
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
    <div className="col-6 abs_cont" ref={parentRef}>
      <div className="refresh_render">
        <FontAwesomeIcon icon="redo" />
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
