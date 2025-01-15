// ice-gun weapon and other items

const iceSound = new Audio("Ice Crack Freeze Sound Effect.mp3"); // Load the ice weapon sound file
const iceRateOfFire = 3; // Number of ice shots per second
const iceShootInterval = 1000 / iceRateOfFire; // Interval between ice shots in milliseconds
const iceDamage = 1.0; // Updated ice weapon damage
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
  for (let i = 0; i < iceBullets.length; i++) {
    // Set the shadow properties for depth
    ctx.shadowColor = "rgba(0, 255, 255, 0.5)"; // Light cyan shadow
    ctx.shadowBlur = 10; // Blur effect
    ctx.shadowOffsetX = 0; // No offset
    ctx.shadowOffsetY = 0; // No offset

    // Create a gradient for the icy look
    const gradient = ctx.createLinearGradient(
      iceBullets[i].x,
      iceBullets[i].y,
      iceBullets[i].x + iceBullets[i].width,
      iceBullets[i].y + iceBullets[i].height
    );
    gradient.addColorStop(0, "rgba(0, 255, 255, 0.8)"); // Light cyan
    gradient.addColorStop(1, "rgba(0, 200, 255, 0.5)"); // Slightly darker cyan

    // Fill the rectangle with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(
      iceBullets[i].x,
      iceBullets[i].y,
      iceBullets[i].width,
      iceBullets[i].height
    );

    // Optional: Draw a light blue outline for texture
    ctx.strokeStyle = "rgba(0, 150, 255, 0.7)"; // Light blue outline
    ctx.lineWidth = 2; // Outline width
    ctx.strokeRect(
      iceBullets[i].x,
      iceBullets[i].y,
      iceBullets[i].width,
      iceBullets[i].height
    );
  }

  // Reset shadow properties to avoid affecting other drawings
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}
// Constants for balancing
const iceSlowEffect = 0.7; // Slowdown factor (30% speed reduction)
const incrementalDamage = 0.3; // Reduced damage per bullet hit
const effectDuration = 2000; // Duration of the effect in milliseconds (2 seconds)
const maxIceStacks = 2; // Maximum number of ice stacks an enemy can have
const damageThreshold = 1.5; // Total damage threshold to apply additional effects

// Apply slowdown effect and incremental damage to enemies hit by ice bullets
function applyIceEffect(enemy, bullet) {
  // Check if the enemy already has the maximum number of ice stacks
  if (enemy.iceStacks >= maxIceStacks) {
    return; // Do not apply further effects if max stacks reached
  }

  // Apply the slowdown effect only once for each bullet hit
  enemy.speed *= iceSlowEffect; // Reduce enemy speed by the slowdown factor
  enemy.iceStacks = (enemy.iceStacks || 0) + 1; // Increment ice stacks

  // Apply incremental damage for this specific bullet
  if (!bullet.effectApplied) {
    enemy.health -= incrementalDamage; // Add incremental damage per bullet hit
    bullet.effectApplied = true; // Mark that the effect has been applied to this bullet
  }

  // Check if total damage exceeds threshold for additional effects
  if (enemy.health <= damageThreshold) {
    // Apply additional effects, e.g., a visual cue or a different status effect
    enemy.isCritical = true; // Example: mark enemy as critical
  }

  // Set enemy color to blue to represent the ice effect
  enemy.isFrozen = true; // Set a flag indicating the enemy is frozen

  // Restore original speed after the effect duration
  setTimeout(() => {
    enemy.speed /= iceSlowEffect; // Restore enemy speed
    enemy.isFrozen = false; // Reset the frozen effect
    enemy.iceStacks--; // Decrement ice stacks
  }, effectDuration); // Slowdown lasts for the specified duration
}

// Global array to hold all damage indicators

const icecollisionSound = new Audio("Collision Sound Effect.mp3"); // Load the collision sound file

const damageSound = new Audio("Damage Sound Effect.mp3"); // Load the damage sound file

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
        // (Assuming you have a function for this)

        // Show the numerical damage indicator
        showDamageNumber(enemy, bullet.damage);

        // Play the collision sound
        icecollisionSound.play();

        // play damage sound
        damageSound.play();

        // Check if the enemy's health is 0 or below, and remove them from the array
        if (enemy.health <= 0) {
          // Remove the enemy from the enemies array
          enemies.splice(j, 1);
          j--; // Adjust index due to removal of the enemy

          // Increment score and coins
          score += 30; // Add 30 points for defeating the enemy
          coins += 8; // Add 8 coins for defeating the enemy
        }

        // Remove the ice bullet after hit
        iceBullets.splice(i, 1);
        i--; // Adjust index due to removal of the bullet
        break; // Exit the loop once the bullet collides with an enemy
      }
    }
  }
}

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
// Missile properties
const missileSound = new Audio("Missile Launch Sound Effect.mp3"); // Load missile sound file
const missileMaxCount = 99; // Maximum number of missiles
const missileCooldown = 2000; // Cooldown between missile launches in milliseconds
const missileDamage = 2; // High damage for missiles
let missileCount = missileMaxCount; // Current missile count
let missileLastShotTime = 0; // Last shot time for missiles

// Missile array
const missiles = [];

// Missile shooting logic
function shootMissile(e) {
  const currentTime = Date.now();

  if (
    e.key === "m" && // Press "M" to shoot a missile
    missileCount > 0 && // Check if missiles are available
    currentTime - missileLastShotTime >= missileCooldown // Check cooldown
  ) {
    // Create the missile
    const missile = {
      x: player.x + player.width / 2 - bulletWidth / 2, // Center the missile
      y: player.y,
      width: bulletWidth * 2, // Larger size
      height: bulletHeight * 2,
      speed: 3, // Slower speed
      damage: missileDamage, // High damage
    };

    missiles.push(missile);
    missileCount--; // Decrease the missile count
    missileLastShotTime = currentTime; // Update last shot time
    missileSound.play(); // Play the missile launch sound effect
  }
}

// Update the position of missiles
function updateMissiles() {
  for (let i = 0; i < missiles.length; i++) {
    missiles[i].y -= missiles[i].speed; // Move the missile upward

    // Remove missiles when they go off the screen
    if (missiles[i].y < 0) {
      missiles.splice(i, 1); // Remove the missile from the array
      i--; // Adjust the index
    }
  }
}

// Draw missiles on the canvas
function drawMissiles() {
  for (let i = 0; i < missiles.length; i++) {
    // Set the shadow properties for depth
    ctx.shadowColor = "rgba(255, 69, 0, 0.5)"; // Red-orange shadow
    ctx.shadowBlur = 20; // Blur effect
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Create a gradient for the fiery look
    const gradient = ctx.createLinearGradient(
      missiles[i].x,
      missiles[i].y,
      missiles[i].x + missiles[i].width,
      missiles[i].y + missiles[i].height
    );
    gradient.addColorStop(0, "rgba(255, 140, 0, 0.8)"); // Bright orange
    gradient.addColorStop(1, "rgba(255, 69, 0, 0.5)"); // Red-orange

    // Draw the missile body
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(missiles[i].x + missiles[i].width / 2, missiles[i].y); // Nose
    ctx.lineTo(missiles[i].x + missiles[i].width, missiles[i].y + missiles[i].height); // Right fin
    ctx.lineTo(missiles[i].x, missiles[i].y + missiles[i].height); // Left fin
    ctx.closePath();
    ctx.fill();

    // Optional: Add a glowing outline for emphasis
    ctx.strokeStyle = "rgba(255, 215, 0, 0.7)"; // Golden outline
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw fins for added realism
    ctx.fillStyle = "rgba(200, 0, 0, 0.8)"; // Darker red for fins
    ctx.beginPath();
    ctx.moveTo(missiles[i].x + missiles[i].width / 2, missiles[i].y + missiles[i].height); // Base of the missile
    ctx.lineTo(missiles[i].x + missiles[i].width * 0.75, missiles[i].y + missiles[i].height + 10); // Right fin
    ctx.lineTo(missiles[i].x + missiles[i].width * 0.25, missiles[i].y + missiles[i].height + 10); // Left fin
    ctx.closePath();
    ctx.fill();

    // Optional: Add a small flame effect at the back of the missile
    ctx.fillStyle = "rgba(255, 69, 0, 0.8)"; // Flame color
    ctx.beginPath();
    ctx.moveTo(missiles[i].x + missiles[i].width / 2, missiles[i].y + missiles[i].height); // Base of the missile
    ctx.lineTo(missiles[i].x + missiles[i].width / 2 - 5, missiles[i].y + missiles[i].height + 10); // Left flame
    ctx.lineTo(missiles[i].x + missiles[i].width / 2 + 5, missiles[i].y + missiles[i].height + 10); // Right flame
    ctx.closePath();
    ctx.fill();
  }

  // Reset shadow properties
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

// Draw the missile count UI text
function drawMissileCount() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Missiles: ${missileCount}`, 20, 30);
}

// Add event listeners for missiles
document.addEventListener("keydown", shootMissile);

// Recharge missiles (optional feature)
//setInterval(() => {
//if (missileCount < missileMaxCount) {
// missileCount++; // Recharge one missile
//}
//}, 10000); // Recharge interval: 10 seconds

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

  // New  weapon Misssile 
  // Update missiles
  updateMissiles();
  // Draw missiles
  drawMissiles();
  // Draw the missile count UI text
  drawMissileCount();
  checkMissileCollisions();
}

gameLoop(); // Start the game loop
