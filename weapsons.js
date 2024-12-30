// ice-gun weapon and other items
const iceSound = new Audio("Ice Crack Freeze Sound Effect.mp3"); // Load the ice weapon sound file
const iceRateOfFire = 3; // Number of ice shots per second
const iceShootInterval = 1000 / iceRateOfFire; // Interval between ice shots in milliseconds
const iceDamage = 1.0; // Updated ice weapon damage
const iceSlowEffect = 0.5; // Slowdown effect (50% speed reduction)
const iceBatteryConsumption = 2; // Battery consumption per ice shot
let isIceShooting = false; // Track if the ice weapon is shooting
let iceLastShotTime = 0; // Last shot time for the ice weapon

// Ice bullets array
const iceBullets = [];

// Ice weapon shooting logic
function shootIceBullet(e) {
  const currentTime = Date.now();

  if (
    e.key === "i" && // Press "I" to shoot ice weapon
    currentTime - iceLastShotTime >= iceShootInterval && // Check rate of fire
    battery >= iceBatteryConsumption // Ensure enough battery is available
  ) {
    if (!isIceShooting) {
      isIceShooting = true;

      // Determine if the shot is accurate
      const isAccurate = Math.random() <= 0.5; // 50% chance to be accurate
      const shotXDeviation = isAccurate ? 0 : (Math.random() - 0.5) * 20; // Deviation for inaccurate shots

      // Create the ice bullet
      const iceBullet = {
        x: player.x + player.width / 2 - bulletWidth / 2 + shotXDeviation, // Apply deviation
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
        speed: 5, // Slower speed for ice bullets
        damage: iceDamage, // Updated damage
        slowEffect: iceSlowEffect, // Slowdown effect
      };

      iceBullets.push(iceBullet);
      iceLastShotTime = currentTime; // Update last shot time
      battery -= iceBatteryConsumption; // Consume battery for the shot
      iceSound.play(); // Play the ice weapon sound effect
    }
  }
}

// Stop shooting ice bullets when the "I" key is released
function stopIceShooting(e) {
  if (e.key === "i") {
    isIceShooting = false;
  }
}

// Update the position of ice bullets
function updateIceBullets() {
  for (let i = 0; i < iceBullets.length; i++) {
    iceBullets[i].y -= iceBullets[i].speed; // Move the bullet upward

    // Remove bullets when they go off the screen
    if (iceBullets[i].y < 0) {
      iceBullets.splice(i, 1); // Remove the bullet from the array
      i--; // Adjust the index
    }
  }
}

// Draw ice bullets on the canvas
function drawIceBullets() {
  ctx.fillStyle = "cyan";
  for (let i = 0; i < iceBullets.length; i++) {
    ctx.fillRect(
      iceBullets[i].x,
      iceBullets[i].y,
      iceBullets[i].width,
      iceBullets[i].height
    );
  }
}

// Apply slowdown effect to enemies hit by ice bullets
// Apply slowdown effect and incremental damage to enemies hit by ice bullets
// Apply slowdown effect and incremental damage to enemies hit by ice bullets
// Apply slowdown effect and incremental damage to enemies hit by ice bullets
function applyIceEffect(enemy, bullet) {
  // Apply the slowdown effect only once for each bullet hit
  enemy.speed *= iceSlowEffect; // Reduce enemy speed by the slowdown factor

  // Apply incremental damage for this specific bullet
  if (!bullet.effectApplied) {
    enemy.health -= 0.5; // Add 0.5 additional damage per bullet hit
    bullet.effectApplied = true; // Mark that the effect has been applied to this bullet
  }

  // Set enemy color to blue to represent the ice effect
  enemy.isFrozen = true; // Set a flag indicating the enemy is frozen

  // Restore original speed after the effect duration (3 seconds)
  setTimeout(() => {
    enemy.speed /= iceSlowEffect; // Restore enemy speed
    enemy.isFrozen = false; // Reset the frozen effect
  }, 3000); // Slowdown lasts 3 seconds
}

// Global array to hold all damage indicators

function detectIceBulletCollisions(enemies) {
  for (let i = 0; i < iceBullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      const bullet = iceBullets[i];
      const enemy = enemies[j];

      // Collision detection logic
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Collision detected, apply base damage
        enemy.health -= bullet.damage;

        // Apply incremental damage and effects from the ice bullet
        applyIceEffect(enemy, bullet);

        // Show ice damage indicator

        // Show the numerical damage indicator
        showDamageNumber(enemy, bullet.damage);

        // Check if the enemy's health is 0 or below, and remove them from the array
        if (enemy.health <= 0) {
          // Remove the enemy from the enemies array
          enemies.splice(j, 1);
          j--; // Adjust index due to removal of the enemy
        }

        // Remove the ice bullet after hit
        iceBullets.splice(i, 1);
        i--; // Adjust index due to removal of the bullet
        break; // Exit the loop once the bullet collides with an enemy
      }
    }
  }
}

// Function to show ice damage indicator (e.g., ice effect visual)
// Global array to hold active indicators
let indicators = [];

// Function to show numerical damage indicator
function showDamageNumber(enemy, damage) {
  // Remove any previous damage indicators for this enemy
  indicators = indicators.filter((indicator) => !(indicator.enemy === enemy));

  // Create a new damage number indicator object
  const damageNumber = {
    enemy: enemy, // Store the enemy reference to identify and replace later
    x: enemy.x + enemy.width / 2, // Position at the center of the enemy
    y: enemy.y - 30, // Slightly above the enemy
    text: `-${damage}`, // Show the numerical damage amount
    color: "#C2DFE1", // Color of the damage number
    size: 24, // Updated text size for the damage number (22px)
    duration: 1.0, // Duration for the effect in seconds
  };

  // Push the damage number to the indicators array
  indicators.push(damageNumber);

  // Remove the damage number after the specified duration
  setTimeout(() => {
    const index = indicators.indexOf(damageNumber);
    if (index > -1) {
      indicators.splice(index, 1); // Remove the damage number after duration
    }
  }, damageNumber.duration * 1000);
}

// Function to render the indicators (e.g., on a canvas)
function renderIndicators(ctx) {
  // Loop through all active indicators and render them
  for (const indicator of indicators) {
    ctx.fillStyle = indicator.color;
    ctx.font = `${indicator.size}px Arial`; // Use the updated size here
    ctx.fillText(indicator.text, indicator.x, indicator.y);

    // Animate the indicator's movement (e.g., move it upwards and fade out)
    indicator.y -= 2; // Move upward
    indicator.size *= 0.98; // Fade text by shrinking font size (optional)
  }
}

// Event listeners for the "I" key press and release
window.addEventListener("keydown", shootIceBullet);
window.addEventListener("keyup", stopIceShooting);

// Event listeners for the "I" key press and release
window.addEventListener("keydown", shootIceBullet);
window.addEventListener("keyup", stopIceShooting);
function gameLoop() {
  if (checkGameOver()) {
    drawGameOver();
    return; // Stop the game loop
  }
  if (paused) {
    drawPauseScreen(); // Display pause screen if paused
    return; // Stop updating and rendering while paused
  }
  clear();
  updatePlayer();
  generateEnemies();
  updateEnemies();
  detectCollisions();
  rechargeBattery(); // Recharge battery over time
  drawPlayer();
  drawCoins();
  drawEnemies();
  drawScore();
  drawBatteryBar(); // Draw the battery bar
  drawPlayerHealthBar(); // Draw the player's health bar
  requestAnimationFrame(gameLoop);
  drawDamageIndicators();
  updateScore();
  drawScore();

  //standard weapon
  updateBullets();
  //bomb effects
  drawBombEffect(); // Draw bomb explosion effect if applicable

  // ice bullets
  // Draw ice bullets
  drawIceBullets();
  // Detect collisions between ice bullets and enemies
  detectIceBulletCollisions(enemies);
  // Update ice bullets
  updateIceBullets();
  renderIndicators(ctx);
  drawBullets();
}

gameLoop(); // Start the game loop
