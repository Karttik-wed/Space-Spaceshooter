const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const playerWidth = 50;
const playerHeight = 30;
const bulletWidth = 5;
const bulletHeight = 15;
const enemyWidth = 50;
const enemyHeight = 30;

let player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvas.height - playerHeight - 10,
  width: playerWidth,
  height: playerHeight,
  speed: 5,
  dx: 0,
  health: 125, // Player health starts at 125
};

let bullets = [];
let enemies = [];
let score = 0;

// Cooldown variables
let lastShotTime = 0; // Time when the last bullet was shot
const cooldownPeriod = 300; // Cooldown period for shooting in milliseconds (300ms)
let lastBatteryCooldownTime = 0; // Time when the last battery consumption was triggered
const batteryCooldownPeriod = 700; // Cooldown period for battery consumption in milliseconds (700ms)

// Battery system variables
let battery = 100; // Current battery level (out of 100)
const batteryMax = 100; // Maximum battery level
const batteryConsumption = 1.0; // Battery consumption per bullet is now 32
const batteryRechargeRate = 0.5; // Slightly slower recharge rate

document.addEventListener("keydown", movePlayer);
document.addEventListener("keyup", stopPlayer);
document.addEventListener("keydown", shootBullet);

// Bomb-specific variables
// Bomb-specific variables
let lastBombTime = 0; // Time when the last bomb was deployed
const bombCooldown = 700; // Cooldown period for bombs (700ms)
const bombBatteryConsumption = 1.8; // Battery consumption for bombs
const bombEffectRadius = 100; // Radius of bomb explosion
let bombEffectStartTime = 0; // T   ime when bomb effect started
let isBombDeployed = false; // Flag to check if bomb is deployed

document.addEventListener("keydown", deployBomb);

function deployBomb(e) {
  const currentTime = Date.now();

  // Check if enough time has passed, and if there is enough battery to deploy a bomb
  if (
    e.key === "b" && // Press "B" to deploy a bomb
    currentTime - lastBombTime >= bombCooldown &&
    battery >= bombBatteryConsumption
  ) {
    // Apply bomb effect to enemies
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = Math.sqrt(
        Math.pow(player.x + player.width / 2 - (enemy.x + enemy.width / 2), 2) +
        Math.pow(
          player.y + player.height / 2 - (enemy.y + enemy.height / 2),
          2
        )
      );

      if (distance <= bombEffectRadius) {
        // Destroy enemy within the bomb radius
        enemies.splice(i, 1);
        score += 10; // Increment score
        coins += 1; // Increment coins
        i--; // Adjust index after removal
      }
    }

    // Deduct battery and update last bomb time
    battery -= bombBatteryConsumption;
    lastBombTime = currentTime;
    bombEffectStartTime = currentTime; // Track the start time for the effect
    isBombDeployed = true; // Mark the bomb as deployed

    // Ensure bomb cooldown resets
    setTimeout(() => {
      isBombDeployed = false;
    }, bombCooldown); // Reset the bomb effect after cooldown
  }
}
function drawBombEffect() {
  if (isBombDeployed) {
    const effectDuration = 1000; // Duration of the explosion effect in milliseconds
    const fadeOutDuration = 200; // Fade-out duration
    const timeElapsed = Date.now() - bombEffectStartTime;

    // Calculate scaling of radius
    const scaleFactor = Math.min(timeElapsed / effectDuration, 1);
    const radius = bombEffectRadius * scaleFactor;

    // Calculate opacity for smooth fade-in and fade-out
    let opacity;
    if (timeElapsed < effectDuration - fadeOutDuration) {
      // Smooth fade-in with ease-out curve
      opacity = 1 - Math.pow(1 - scaleFactor, 3);
    } else {
      // Smooth fade-out
      const fadeOutScale =
        (timeElapsed - (effectDuration - fadeOutDuration)) / fadeOutDuration;
      opacity = Math.max(0, Math.pow(1 - fadeOutScale, 3));
    }

    // Create a radial gradient for enhanced visual effect
    const gradient = ctx.createRadialGradient(
      player.x + player.width / 2, // Center of the explosion
      player.y + player.height / 2,
      0, // Inner radius
      player.x + player.width / 2,
      player.y + player.height / 2,
      radius // Outer radius
    );
    gradient.addColorStop(0, `rgba(255, 255, 0, ${opacity})`); // Bright yellow at the center
    gradient.addColorStop(0.5, `rgba(255, 165, 0, ${opacity * 0.8})`); // Orange mid-point
    gradient.addColorStop(1, `rgba(255, 69, 0, ${opacity * 0.6})`); // Red at the edges

    // Draw explosion effect with gradient
    ctx.save(); // Save the canvas state
    ctx.globalCompositeOperation = "lighter"; // Create a glowing effect by blending
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      player.x + player.width / 2,
      player.y + player.height / 2,
      radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore(); // Restore the canvas state

    // Reset after the effect duration ends
    if (timeElapsed >= effectDuration) {
      isBombDeployed = false;
    }
  }
}

function movePlayer(e) {
  if (e.key === "ArrowLeft") {
    player.dx = -player.speed;
  } else if (e.key === "ArrowRight") {
    player.dx = player.speed;
  }
}
function stopPlayer(e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    player.dx = 0; // Stop horizontal movement
  }
}

const bulletSound = new Audio("bulletsoundcanon1.mp3"); // Load the bullet sound file
let isShooting = false; // To track whether the spacebar is being held down
const rateOfFire = 10; // Number of shots per second
const shootInterval = 1000 / rateOfFire; // Interval between shots in milliseconds
//bullet damage
const bulletDamage = 0.9;

function shootBullet(e) {
  const currentTime = Date.now();

  // Check if the spacebar is pressed and other conditions (cooldown, battery, etc.)
  if (
    e.key === " " &&
    currentTime - lastShotTime >= cooldownPeriod && // Cooldown check for shooting
    battery >= batteryConsumption && // Check if enough battery is available
    currentTime - lastBatteryCooldownTime >= batteryCooldownPeriod
  ) {
    // Battery cooldown check

    // Start shooting if the spacebar is pressed and not already shooting
    if (!isShooting) {
      isShooting = true;
      shootIntervalID = setInterval(() => {
        // Shoot continuously at the defined interval
        const currentShotTime = Date.now();
        if (
          currentShotTime - lastShotTime >= cooldownPeriod &&
          battery >= batteryConsumption &&
          currentShotTime - lastBatteryCooldownTime >= batteryCooldownPeriod
        ) {
          // Calculate if the shot is accurate or inaccurate
          const isAccurate = Math.random() <= 0.3; // 30% chance to be accurate
          const shotXDeviation = isAccurate ? 0 : (Math.random() - 0.5) * 20; // Deviation

          // Create the bullet with potential X deviation if inaccurate
          bullets.push({
            x: player.x + player.width / 2 - bulletWidth / 2 + shotXDeviation, // Apply deviation
            y: player.y,
            width: bulletWidth,
            height: bulletHeight,
            speed: 7,
            damage: bulletDamage, // Bullet damage
          });

          lastShotTime = currentShotTime; // Update last shot time
          battery -= batteryConsumption; // Reduce battery
          lastBatteryCooldownTime = currentShotTime; // Update last battery consumption time

          bulletSound.play(); // Play the bullet sound effect per shot
        }
      }, shootInterval); // Shoot every `shootInterval` milliseconds
    }
  }
}

// Stop shooting when the spacebar is released
function stopShooting(e) {
  if (e.key === " ") {
    isShooting = false;
    clearInterval(shootIntervalID); // Stop shooting
  }
}

function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;

    // Remove bullets when they go off screen
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

function drawBullets() {
  // Create a fading effect on the canvas
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Adjust the alpha for stronger or weaker trails
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Apply the fade

  // Draw bullets with rounded rectangles
  ctx.fillStyle = "yellow";
  for (let i = 0; i < bullets.length; i++) {
    const { x, y, width, height } = bullets[i];
    ctx.beginPath();
    const radius = 4; // Adjust as needed
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }
}

// Event listeners for the spacebar press and release
window.addEventListener("keydown", shootBullet);
window.addEventListener("keyup", stopShooting);

function updatePlayer() {
  player.x += player.dx;
  // Prevent the player from moving off the screen
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

let coins = 0; // Add a variable to track coins collected

function drawCoins() {
  // Enable anti-aliasing for smoother rendering of shapes and text
  ctx.imageSmoothingEnabled = true;

  // Set font and style for text
  ctx.fillStyle = "White";
  ctx.font = "20px Arial";

  // Add shadow for better text visibility
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;

  // Draw the label text ("Coins:")
  ctx.fillText("Coins:", 10, 60); // Position for the label text

  // Draw the coins count
  ctx.fillText(`${coins}`, 80, 60); // Position for the coin count text

  // Reset shadow to avoid affecting other drawings
  ctx.shadowBlur = 0;
}

// Function to trigger damage effect (to be called when the player is hit)

function triggerDamageEffect() {
  player.damageEffect = { time: 30 }; // Effect lasts for 30 frames
}

// Updated drawPlayer function with collision visuals
function drawPlayer() {
  // Check if the player is in a "damaged" state
  const isDamaged = player.damageEffect && player.damageEffect.time > 0;

  // Flicker effect by alternating colors when damaged
  if (isDamaged) {
    player.damageEffect.time--; // Decrease the damage effect time
    if (player.damageEffect.time % 10 < 5) {
      ctx.fillStyle = "#FFD580"; // Damaged flicker color
    } else {
      ctx.fillStyle = "white"; // Normal color
    }
  } else {
    ctx.fillStyle = "white"; // Normal color
  }

  // Draw the main body of the spaceship (a triangle for a classic look)
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y); // Tip of the spaceship
  ctx.lineTo(player.x, player.y + player.height); // Bottom-left corner
  ctx.lineTo(player.x + player.width, player.y + player.height); // Bottom-right corner
  ctx.closePath();
  ctx.fill();

  // Draw the cockpit (a small circle near the tip)
  ctx.fillStyle = isDamaged ? "darkred" : "blue"; // Cockpit changes color when damaged
  ctx.beginPath();
  ctx.arc(
    player.x + player.width / 2,
    player.y + player.height / 3,
    player.width / 6,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw the engines (two small rectangles at the bottom corners)
  ctx.fillStyle = isDamaged ? "darkgray" : "gray"; // Engines change color when damaged
  ctx.fillRect(
    player.x + player.width / 6,
    player.y + player.height,
    player.width / 6,
    player.height / 4
  );
  ctx.fillRect(
    player.x + (player.width * 2) / 3,
    player.y + player.height,
    player.width / 6,
    player.height / 4
  );

  // Optional: Draw an outline or glow around the player when damaged
  if (isDamaged) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function checkGameOver() {
  if (player.health <= 0) {
    return true;
  }
  return false;
}
function drawGameOver() {
  // Load the game over sound
  const gameOverSound = new Audio("gameOverSound.mp3"); // Provide the path to your sound file

  // Play the sound
  gameOverSound.play();

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 60);
  ctx.font = "20px Arial";
  ctx.fillText(
    `Final Score: ${score}`,
    canvas.width / 2 - 60,
    canvas.height / 2
  );
  ctx.fillText(
    `Coins Collected: ${coins}`,
    canvas.width / 2 - 80,
    canvas.height / 2 + 40
  );
  ctx.fillText(
    "Press 'R' to Restart",
    canvas.width / 2 - 80,
    canvas.height / 2 + 80
  );

  // Array of motivational quotes
  const quotes = [
    "Don't stop when you're tired. Stop when you're done.",
    "Every failure is a step closer to success.",
    "Winners never quit, and quitters never win.",
    "The harder the battle, the sweeter the victory.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Push yourself because no one else is going to do it for you.",
    "Believe you can, and you're halfway there.",
    "It's not whether you get knocked down; it's whether you get up.",
    "Failure is simply the opportunity to begin again, this time more intelligently.",
    "Dream big, work hard, stay focused, and surround yourself with good people.",
  ];

  // Select a random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Display the random quote
  ctx.font = "18px Arial";
  ctx.fillStyle = "white"; // Set the text color to white
  ctx.fillText(
    randomQuote,
    canvas.width / 2 - ctx.measureText(randomQuote).width / 2,
    canvas.height / 2 + 120
  );
}

document.addEventListener("keydown", restartGame);

function restartGame(e) {
  if (e.key === "r" || e.key === "R") {
    // Reset game variables
    player.health = 125;
    player.x = canvas.width / 2 - playerWidth / 2;
    player.y = canvas.height - playerHeight - 10;
    player.dx = 0;

    bullets = [];
    enemies = [];
    score = 0;
    coins = 0;
    battery = 100;

    // Reset the cooldown timers
    lastShotTime = 0;
    lastBatteryCooldownTime = 0;
    lastBombTime = 0;
    lastBatteryRegenTime = 0;
    bombEffectStartTime = 0;

    // Restart the game loop
    gameLoop();
  }
}

// Initialize variables for score and high score

let highScore = 0;
const marginTop = 50; // Set the margin at the top

function drawScore() {
  // Enable anti-aliasing for smoother text
  ctx.imageSmoothingEnabled = true;

  // Set font and style
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  // Add a shadow for better text visibility
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;

  // Draw the score text with margin
  ctx.fillText(`Score: ${score}`, 10, marginTop + 30);

  // Draw the high score text with margin
  ctx.fillText(`Highscore: ${highScore}`, 10, marginTop + 60);

  // Reset shadow to avoid affecting other drawings
  ctx.shadowBlur = 0;
}

// Call this function whenever the score is updated to update the high score as well
function updateScore() {
  if (score > highScore) {
    highScore = score; // Update high score if the current score is higher
  }
}

// Call this function whenever the score is updated to update the high score as well

function drawPlayerHealthBar() {
  const barWidth = 20; // Width of the health bar
  const barHeight = 125; // Height of the health bar
  const canvasWidth = ctx.canvas.width; // Width of the canvas
  const xPosition = canvasWidth - barWidth - 50; // Position the bar 50px from the right edge
  const yPosition = 10; // Top position of the bar

  // Ensure player health is within the valid range
  const validHealth = Math.max(0, Math.min(player.health, barHeight));

  ctx.fillStyle = "gray";
  ctx.fillRect(xPosition, yPosition, barWidth, barHeight); // Draw the background of the health bar

  ctx.fillStyle = "red";
  ctx.fillRect(
    xPosition,
    yPosition + (barHeight - validHealth), // Adjust the position based on the player's health
    barWidth,
    validHealth // Ensure the health doesn't exceed the bar's height
  ); // Draw the foreground of the health bar
}

// Function to recharge the battery over time
// Time tracking for battery regeneration (1 unit per second)
let lastBatteryRegenTime = 0; // Last time the battery was regenerated

function rechargeBattery() {
  const currentTime = Date.now();

  // Check if at least 1 second has passed since the last regeneration
  if (battery < batteryMax && currentTime - lastBatteryRegenTime >= 1000) {
    battery += 0.6; // Recharge 0.6 unit of battery
    lastBatteryRegenTime = currentTime; // Update the last regeneration time
  }
}

// Drawing the battery bar
function drawBatteryBar() {
  const barWidth = 20; // Width of the battery bar
  const barHeight = batteryMax * 2; // Maximum height of the battery bar
  const xPosition = 10; // Position from the left side of the canvas
  const yPosition = canvas.height - barHeight - 10; // Position from the bottom, accounting for padding

  // Draw the background of the battery bar
  ctx.fillStyle = "gray";
  ctx.fillRect(xPosition, yPosition, barWidth, barHeight);

  // Draw the foreground of the battery bar (green area)
  ctx.fillStyle = "green";
  ctx.fillRect(
    xPosition,
    yPosition + (barHeight - battery * 2), // Adjust Y position for the current battery level
    barWidth,
    battery * 2 // Foreground height proportional to battery level
  );
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let paused = false; // Track if the game is paused

document.addEventListener("keydown", togglePause);

function togglePause(e) {
  if (e.key === "Escape") {
    // Press 'Escape' to pause/resume
    paused = !paused; // Toggle the paused state
    if (!paused) {
      gameLoop(); // Resume the game loop if unpaused
    }
  }
}

let pauseTime = 0; // Tracks elapsed time (not used for movement now)

function drawPauseScreen() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw floating particles
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width;
    const y = (Math.random() * canvas.height + pauseTime) % canvas.height;
    const size = Math.random() * 3 + 1;

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw "PAUSED" text with debug background
  ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Debug background
  ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 60, 200, 50); // Debug box

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2 - 30);

  // Draw "Press 'Esc' to Resume" text
  ctx.font = "20px Arial";
  ctx.fillText(
    "Press 'Esc' to Resume",
    canvas.width / 2,
    canvas.height / 2 + 30
  );
}

// Create a new Audio object for background music
const bgMusic = new Audio("spacebg1.mp3");

// Set the audio to loop indefinitely
bgMusic.loop = true;

// Set the initial audio volume to 0 (muted)
bgMusic.volume = 0;

// Function to fade in the music
function fadeInAudio(duration) {
  let startVolume = 0;
  let endVolume = 0.2; // Final volume after fade-in
  let increment = (endVolume - startVolume) / (duration / 50); // Adjust the increment to fit the duration

  let fadeInInterval = setInterval(() => {
    if (bgMusic.volume < endVolume) {
      bgMusic.volume += increment;
    } else {
      clearInterval(fadeInInterval); // Stop when target volume is reached
    }
  }, 50); // 50ms interval for smooth fade-in
}

// Function to fade out the music
function fadeOutAudio(duration) {
  let startVolume = bgMusic.volume;
  let endVolume = 0; // Final volume after fade-out
  let increment = (startVolume - endVolume) / (duration / 50); // Adjust the increment to fit the duration

  let fadeOutInterval = setInterval(() => {
    if (bgMusic.volume > endVolume) {
      bgMusic.volume -= increment;
    } else {
      clearInterval(fadeOutInterval); // Stop when target volume is reached
      bgMusic.pause(); // Optionally pause the music once faded out
    }
  }, 50); // 50ms interval for smooth fade-out
}

// Play the background music when the game starts and fade it in
bgMusic.play();
fadeInAudio(3000); // Fade in over 3 seconds

// Add event listener to handle fade-out when needed (e.g., game over or pause)
bgMusic.addEventListener("ended", () => {
  fadeOutAudio(3000); // Fade out over 3 seconds
});
