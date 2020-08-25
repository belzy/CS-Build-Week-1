import React, { useEffect } from 'react';

function App() {

  let canvasRef;

  useEffect(() => {

    // Cell size: 20px

    let ctx = canvasRef.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
    let screenBuffer = imageData.data;
    console.log(screenBuffer);

  }, [canvasRef]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <canvas width='500' height='500' ref={ ref => canvasRef = ref } style={{ border: '1px solid black' }}>

      </canvas>

    </div>
  );
}

export default App;
