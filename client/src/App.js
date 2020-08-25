import React, { useEffect } from 'react';

class GraphNode {

}


// Utils
const getPixelsFromScreenBuffer = screenBuffer => {
  // Create a 2D array from screenBuffer where every sub array 
  // contains 4 values representing the rgba values of a pixel.

  const pixels = [];
  screenBuffer.forEach((e, i) => {

    if (pixels.length < screenBuffer.length) {
      if (i % 4 === 0) {
        pixels.push([]);
      }

      pixels[pixels.length - 1].push(e);
    }

  });

  return pixels;
};

const setPixelColor = (pixels, index, rgba) => {
  pixels[index][0] = rgba[0]; // R
  pixels[index][1] = rgba[1]; // G
  pixels[index][2] = rgba[2]; // B
  pixels[index][3] = rgba[3]; // A
}

const getCellPixels = (cellNum, canvasSize, cellSize) => {

  /**
   * canvasSize / cellSize = cellsPerRow
   * cellSize * (cellNum - cellsPerRow) = startPixelInRow
   * Math.floor(cellNum / cellsPerRow) = cellRow
   * canvasSize * (cellSize * cellRow) = startPixel (on border) // - ((Math.floor(cellNum / cellsPerRow) - 1) * canvasSize)
   * startPixel + canvasSize + 1 = actualStartPixel (off border)
   */

  const cellsPerRow = Math.round(canvasSize / cellSize);

  let startPixel;
  if (cellNum >= cellsPerRow) {
    startPixel = (((cellSize * (cellNum - cellsPerRow)) + (canvasSize * (cellSize * (Math.floor(cellNum / cellsPerRow))))) - ((Math.floor(cellNum / cellsPerRow) - 1) * canvasSize)) + canvasSize + 1;
  } else {
    startPixel = (cellSize * cellNum) + canvasSize + 1;
  }

  const cellPixels = [];

  // cellSize - 1 to account for cell border
  for (let column = 0; column < cellSize - 1; column++) {
    for (let row = column * canvasSize; row < (column * canvasSize) + cellSize - 1; row++) {
      cellPixels.push(startPixel + row);
    }
  }

  return cellPixels;
}

function App() {

  let canvasRef;
  const canvasSize = 700;
  const cellSize = 10;

  const colors = {
    white: [255, 255, 255, 255],
    black: [0, 0, 0, 255],
    gray: [197, 190, 190, 255],
    red: [255, 0, 0, 255]
  };



  useEffect(() => {

    // Cell size: 20px
    // rgba(197, 190, 190, 1); // Gray for border

    let ctx = canvasRef.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
    let screenBuffer = imageData.data;

    const pixels = getPixelsFromScreenBuffer(screenBuffer);
    /******************************************************/

    const { gray, white, black, red } = colors;

    // Set all cells to white.
    pixels.forEach((pixel, i) => setPixelColor(pixels, i, white));

    // Create cell borders
    for (let pixel = 0; pixel < pixels.length; pixel++) {

      if (Math.floor(pixel / canvasSize) % cellSize === 0) {
        setPixelColor(pixels, pixel, gray);
      } else if (!Math.floor(pixel / canvasSize) % cellSize === 0 && (pixel % cellSize === 0 || pixel % canvasSize === canvasSize - 1)) {
        setPixelColor(pixels, pixel, gray);
      }

    }

    // Get Cells
    // Get clicked cell
    // Get a cells neighbers

    // A cell should have a live/dead state.
    // References to all the pixels inside the cell
    // References to all its neighbors
    // Research graph data structure

    

    const cellPixels = getCellPixels(70, canvasSize, cellSize);

    cellPixels.forEach(pixel => setPixelColor(pixels, pixel, black));

    // setPixelColor(pixels, startPixel, black);

    /**
    
      [
        1-9
        501-509
        1001-1009
        ...x20
      ]


      cell = {
        alive: false,
        pixels: [1-19]
        neighbors: [cellRef x8]
      }
    
    */


    // setPixelColor(pixels, 4, black);







    /******************************************************/
    // Flatten pixels.
    screenBuffer = pixels.reduce((acc, arr) => {

      for (let i = 0; i < arr.length; i++) {
        acc.push(arr[i]);
      }

      return acc;
    }, []);

    // Transfer data to imageData
    for (let i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = screenBuffer[i];
    }

    // Apply changes to canvas.
    ctx.putImageData(imageData, 0, 0);

  }, [canvasRef, colors]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <canvas width={ canvasSize } height={ canvasSize + 1 } ref={ ref => canvasRef = ref } /*style={{ border: '1px solid black' }}*/></canvas>

    </div>
  );
}

export default App;
