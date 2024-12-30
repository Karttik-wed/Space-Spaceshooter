let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function calculateFPS() {
  const currentTime = performance.now();
  frameCount++;

  // Only calculate FPS once per second
  if (currentTime - lastTime >= 1000) {
    fps = frameCount; // Set FPS
    frameCount = 0; // Reset frame counter
    lastTime = currentTime; // Reset the timer
    console.clear(); // Clear the console for a clean log (optional)
    console.log(`FPS: ${fps}`); // Log the FPS
  }

  requestAnimationFrame(calculateFPS); // Continue the loop
}

calculateFPS();
