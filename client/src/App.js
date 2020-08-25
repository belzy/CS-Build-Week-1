import React, { useEffect } from 'react';

function App() {

  const canvasSize = 800;
  const cellSize = 10;
  let canvasRef;



  useEffect(() => {

    // Cell size: 20px
    // rgba(197, 190, 190, 1); // Gray for border

    let ctx = canvasRef.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
    let screenBuffer = imageData.data;

    const get2DScreenBuffer = screenBuffer => {
      // Create a 2D array from screenBuffer where every sub array 
      // contains 4 values representing the rgba values of a pixel.

      const screenBuffer2D = [];
      screenBuffer.forEach((e, i) => {

        if (screenBuffer2D.length < screenBuffer.length) {
          if (i % 4 === 0) {
            screenBuffer2D.push([]);
          }

          // console.log(screenBuffer2D);
          screenBuffer2D[screenBuffer2D.length - 1].push(e);
        }

      });

      return screenBuffer2D;
    };

    const screenBuffer2D = get2DScreenBuffer(screenBuffer);

    // Create cell borders
    for (let i = 0; i < screenBuffer2D.length; i++) {

      const setPixelColor = (screenBuffer2D, index, rgba) => {
        screenBuffer2D[index][0] = rgba[0]; // R
        screenBuffer2D[index][1] = rgba[1]; // G
        screenBuffer2D[index][2] = rgba[2]; // B
        screenBuffer2D[index][3] = rgba[3]; // A
      }

      if (Math.floor(i / canvasSize) % cellSize === 0) {
        setPixelColor(screenBuffer2D, i, [197, 190, 190, 255]);
      } else if (!Math.floor(i / canvasSize) % cellSize === 0 && (i % cellSize === 0 || i % canvasSize === canvasSize - 1)) {
        setPixelColor(screenBuffer2D, i, [197, 190, 190, 255]);
      }

    }

    // Flatten screenBuffer2D.
    screenBuffer = screenBuffer2D.reduce((acc, arr) => {

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

  }, [canvasRef]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <canvas width={ canvasSize } height={ canvasSize + 1 } ref={ ref => canvasRef = ref } /*style={{ border: '1px solid black' }}*/>

      </canvas>

    </div>
  );
}

export default App;
