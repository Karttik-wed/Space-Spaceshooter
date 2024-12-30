"use strict";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var playerWidth = 50;
var playerHeight = 30;
var playerSpeed = 5;
var enemyWidth = 40;
var enemyHeight = 30;
var enemySpeed = 2;
var enemyHealth = 1.5; // Array of enemy types with their properties
// Define enemy types with unique properties for each type

var enemyTypes = [{
  color: "green",
  health: 1.5,
  speed: enemySpeed
}, {
  color: "yellow",
  health: 2,
  speed: enemySpeed
}, {
  color: "orange",
  health: 5,
  speed: enemySpeed * 1.2 // Slightly faster for challenge

}, {
  color: "blue",
  health: 4,
  speed: enemySpeed * 0.8,
  // Slower due to shield
  shield: 3 // New shield property

}, {
  color: "purple",
  health: 8,
  speed: enemySpeed * 0.6,
  // Slower for heavy enemy
  size: 1.5 // Larger size to represent toughness

}, {
  color: "red",
  health: 12,
  speed: enemySpeed,
  shield: 1 // Light shield for extra challenge

}, {
  color: "grey",
  health: 15,
  speed: enemySpeed,
  shield: 5 // High shield for resilience

}]; // Detect if device is mobile or desktop

var isMobile = window.innerWidth <= 768; // Adjust threshold as needed
// Define min and max enemies to be spawned based on device type

var minEnemies = isMobile ? 4 : 5;
var maxEnemies = isMobile ? 2 : 4; // Timing for enemy spawning

var lastSpawnTime = 0;
var spawnInterval = 2000; // Spawn new enemies every 2 seconds
// Function to create an enemy with randomized properties

function createEnemy() {
  var enemyWidth = 40;
  var enemyHeight = 40;
  var x, y;
  var overlap; // Loop until an enemy spawns without overlapping others

  do {
    x = Math.random() * (canvas.width - enemyWidth); // Random horizontal position

    y = -enemyHeight; // Start above the canvas

    overlap = false; // Check for overlap with existing enemies

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = enemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var otherEnemy = _step.value;
        var isOverlapping = x < otherEnemy.x + otherEnemy.width && x + enemyWidth > otherEnemy.x && y < otherEnemy.y + otherEnemy.height && y + enemyHeight > otherEnemy.y;

        if (isOverlapping) {
          overlap = true;
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } while (overlap); // Randomly select an enemy type


  var enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]; // Add the new enemy with selected type's attributes

  enemies.push({
    x: x,
    y: y,
    width: enemyWidth,
    height: enemyHeight,
    health: enemyType.health,
    color: enemyType.color,
    speed: enemyType.speed,
    shield: enemyType.shield || 0 // Default shield to 0 if undefined

  });
} // Function to manage enemy spawning at intervals


function spawnEnemies() {
  var now = Date.now();

  if (now - lastSpawnTime > spawnInterval) {
    lastSpawnTime = now; // Randomize the number of enemies to spawn based on device type limits

    var numberOfEnemies = Math.floor(Math.random() * (maxEnemies - minEnemies + 1)) + minEnemies; // Create each enemy within the range specified

    for (var i = 0; i < numberOfEnemies; i++) {
      createEnemy();
    }
  }
} ///grey  enmey hi  enme  hp and  shield
// Function to draw all enemies on the canvas


function drawEnemies() {
  try {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = enemies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var enemy = _step2.value;
        ctx.save(); // Spaceship body with more realistic shading

        var bodyGradient = ctx.createLinearGradient(enemy.x, enemy.y, enemy.x + enemy.width, enemy.y + enemy.height);
        bodyGradient.addColorStop(0, enemy.color); // Base color

        bodyGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.3)"); // Slight reflection

        bodyGradient.addColorStop(1, "rgba(0, 0, 0, 0.5)"); // Shaded bottom

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        ctx.lineTo(enemy.x + enemy.width, enemy.y);
        ctx.lineTo(enemy.x, enemy.y);
        ctx.closePath();
        ctx.fill(); // Cockpit glass reflection effect

        var cockpitGradient = ctx.createRadialGradient(enemy.x + enemy.width / 2, enemy.y + enemy.height * 2 / 3, enemy.width / 8, enemy.x + enemy.width / 2, enemy.y + enemy.height * 2 / 3, enemy.width / 4);
        cockpitGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)"); // Inner bright glass

        cockpitGradient.addColorStop(1, "rgba(60, 60, 60, 0.7)"); // Darker glass edge

        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height * 2 / 3, enemy.width / 4, 0, Math.PI * 2);
        ctx.fill(); // Wings with metallic effect and shadow

        var wingGradient = ctx.createLinearGradient(enemy.x, enemy.y + enemy.height * 0.4, enemy.x - enemy.width / 4, enemy.y);
        wingGradient.addColorStop(0, enemy.color);
        wingGradient.addColorStop(1, "rgba(0, 0, 0, 0.5)"); // Shadowed wings

        ctx.fillStyle = wingGradient;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y + enemy.height * 0.4);
        ctx.lineTo(enemy.x - enemy.width / 4, enemy.y);
        ctx.lineTo(enemy.x, enemy.y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = wingGradient;
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width, enemy.y + enemy.height * 0.4);
        ctx.lineTo(enemy.x + enemy.width + enemy.width / 4, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y);
        ctx.closePath();
        ctx.fill(); // Exhaust flames with a glow effect

        var exhaustGradient = ctx.createRadialGradient(enemy.x + enemy.width / 2, enemy.y + enemy.height + 15, 5, enemy.x + enemy.width / 2, enemy.y + enemy.height + 15, 25);
        exhaustGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)"); // Bright core

        exhaustGradient.addColorStop(0.5, "rgba(255, 140, 0, 0.8)"); // Outer glow

        exhaustGradient.addColorStop(1, "rgba(255, 0, 0, 0.5)"); // Red fade

        ctx.fillStyle = exhaustGradient;
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width / 4, enemy.y + enemy.height);
        ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height + 25); // Extended flames

        ctx.lineTo(enemy.x + 3 * enemy.width / 4, enemy.y + enemy.height);
        ctx.closePath();
        ctx.fill(); // Panel lines for extra realism

        ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width / 4, enemy.y + enemy.height / 3);
        ctx.lineTo(enemy.x + 3 * enemy.width / 4, enemy.y + enemy.height / 3);
        ctx.stroke(); // Add subtle surface reflections on wings and cockpit

        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y + enemy.height * 0.4);
        ctx.lineTo(enemy.x - enemy.width / 6, enemy.y + enemy.height * 0.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width, enemy.y + enemy.height * 0.4);
        ctx.lineTo(enemy.x + enemy.width + enemy.width / 6, enemy.y + enemy.height * 0.35);
        ctx.stroke();
        ctx.restore();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  } catch (error) {
    console.error("Error drawing enemies:", error);
  }
} // Function to move and check for collisions with enemies


function moveEnemies() {
  for (var _i = 0, _enemies = enemies; _i < _enemies.length; _i++) {
    var enemy = _enemies[_i];
    enemy.y += enemy.speed; // Check for collision between player and enemy

    if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x && player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
      // Base damage calculation
      var damage = 0;

      switch (enemy.color) {
        case "yellow":
          damage = 4;
          break;

        case "orange":
          damage = 5;
          break;

        case "blue":
          damage = 6; // 2x damage for blue enemies

          break;

        case "purple":
          damage = 7;
          break;

        case "green":
          damage = 2;
          break;

        default:
          damage = 10;
        // Default damage
      } // Determine if the attack is a critical hit


      var criticalHitChance = Math.random() * (0.27 - 0.05) + 0.05; // 5% to 27%

      var isCriticalHit = Math.random() < criticalHitChance;

      if (isCriticalHit) {
        damage *= 1.5; // Increase damage by 50% for critical hits
      } // Calculate damage reduction based on player's shield


      var shieldReduction = Math.min(player.shield, damage);
      player.shield -= shieldReduction;
      damage -= shieldReduction; // Display shield damage indicator if shield absorbed damage

      if (shieldReduction > 0) {
        playerDamageIndicators.push({
          x: player.x + player.width / 2 - 10,
          y: player.y - 20,
          text: "-".concat(shieldReduction.toFixed(1), " SHIELD"),
          color: "blue",
          creationTime: Date.now(),
          life: 1000,
          fontSize: 20,
          opacity: 1,
          riseSpeed: 0.4
        });
      } // Apply and show remaining damage to the player's health


      if (damage > 0) {
        player.health -= damage;
        player.isHit = true;
        player.hitTime = Date.now(); // Display health damage indicator

        playerDamageIndicators.push({
          x: player.x + player.width / 2 - 10,
          y: player.y - 20,
          text: isCriticalHit ? "-".concat(damage.toFixed(1), " CRIT") : "-".concat(damage.toFixed(1)),
          color: isCriticalHit ? "red" : "orange",
          creationTime: Date.now(),
          life: 1000,
          fontSize: isCriticalHit ? 28 : 20,
          opacity: 1,
          riseSpeed: 0.5
        }); // Add critical hit indicator

        if (isCriticalHit) {
          damageIndicators.push({
            x: player.x + player.width / 2,
            y: player.y - 30,
            text: "CRITICAL HIT!",
            color: "red",
            creationTime: Date.now(),
            life: 1000,
            fontSize: 28,
            opacity: 1,
            riseSpeed: 0.7,
            scale: 1.2
          });
        }
      } // Remove the enemy after the collision


      enemies.splice(enemies.indexOf(enemy), 1);
    }
  }

  if (player.health <= 0) {
    displayGameOver();
  } // Remove enemies that are out of the canvas


  enemies = enemies.filter(function (enemy) {
    return enemy.y < canvas.height;
  });
}

function displayGameOver() {
  // Create a full-screen overlay
  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.color = "white";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";
  overlay.style.fontFamily = "Arial, sans-serif"; // Create Game Over text

  var gameOverText = document.createElement("h1");
  gameOverText.textContent = "Game Over";
  gameOverText.style.fontSize = "60px";
  overlay.appendChild(gameOverText); // Create Restart instruction text

  var restartText = document.createElement("p");
  restartText.textContent = "Restarting in 2 seconds...";
  restartText.style.fontSize = "24px";
  overlay.appendChild(restartText); // Append the overlay to the body

  document.body.appendChild(overlay); // Auto-restart the game after a delay

  setTimeout(restartGame, 2000); // Adjust the delay (2000 ms = 2 seconds) as needed
} // Function to handle game restart logic


function restartGame() {
  // Remove the game over overlay
  var overlay = document.querySelector("div");

  if (overlay) {
    document.body.removeChild(overlay);
  } // Reload the page after removing the overlay


  location.reload();
}

var player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvas.height - playerHeight - 10,
  width: playerWidth,
  height: playerHeight,
  health: 100,
  isHit: false,
  hitTime: 0,
  shield: 35 // Player's shield with max value of 30

};
var bullets = [];
var enemies = [];
var score = 0;
var coins = 0;
var coinsPerEnemy = 4;
var damageIndicators = [];
var playerDamageIndicators = [];

for (var i = 0; i < 5; i++) {
  createEnemy();
} // Function to draw damage indicators with enhanced effects


function drawDamageIndicators() {
  var currentTime = Date.now();

  for (var _i2 = damageIndicators.length - 1; _i2 >= 0; _i2--) {
    var indicator = damageIndicators[_i2];
    var age = currentTime - indicator.creationTime;

    if (age > indicator.life) {
      // Remove indicator after life duration
      damageIndicators.splice(_i2, 1);
      continue;
    } // Calculate progress (0 to 1) over the life of the indicator


    var progress = age / indicator.life; // Apply fading effect (opacity decreases)

    indicator.opacity = 1 - progress; // Apply floating effect (indicator rises)

    indicator.y -= indicator.riseSpeed; // Scale effect (starts large and shrinks slightly over time)

    var scale = 1 + (indicator.scale - 1) * (1 - progress); // Apply styles and transformations

    ctx.save();
    ctx.globalAlpha = indicator.opacity;
    ctx.font = "bold ".concat(Math.floor(indicator.fontSize * scale), "px Arial");
    ctx.fillStyle = indicator.color; // Shadow for better readability

    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3; // Draw the critical hit text

    ctx.fillText(indicator.text, indicator.x, indicator.y); // Restore the canvas context to avoid affecting other elements

    ctx.restore();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.angle); // Draw spaceship body with a more complex gradient

  var bodyGrad = ctx.createLinearGradient(-player.width / 2, -player.height / 2, player.width / 2, player.height / 2);
  bodyGrad.addColorStop(0, "#4a4a4a"); // Dark metallic gray

  bodyGrad.addColorStop(0.5, "#b0b0b0"); // Medium metallic gray

  bodyGrad.addColorStop(1, "#ffffff"); // Light metallic gray

  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2);
  ctx.lineTo(player.width / 2, player.height / 3); // Changed the body shape for uniqueness

  ctx.lineTo(player.width / 4, player.height / 2);
  ctx.lineTo(-player.width / 4, player.height / 2);
  ctx.lineTo(-player.width / 2, player.height / 3);
  ctx.closePath();

  if (player.isHit) {
    ctx.fillStyle = "orange"; // Flash player when hit
  } else {
    ctx.fillStyle = bodyGrad; // Use gradient fill for realistic look
  }

  ctx.fill(); // Add a highlight to the body

  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2 + 5); // Slightly adjusted position for uniqueness

  ctx.lineTo(player.width / 3, -player.height / 4);
  ctx.lineTo(-player.width / 3, -player.height / 4);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // Brighter highlight

  ctx.fill(); // Draw cockpit with a radial gradient and add a border

  ctx.beginPath();
  var cockpitGrad = ctx.createRadialGradient(0, 0, player.width / 8, 0, 0, player.width / 4);
  cockpitGrad.addColorStop(0, "#00aaff"); // Light blue

  cockpitGrad.addColorStop(1, "#005577"); // Dark blue

  ctx.arc(0, 0, player.width / 4, 0, Math.PI * 2);
  ctx.fillStyle = cockpitGrad;
  ctx.fill(); // Add a shadow to the cockpit

  ctx.beginPath();
  ctx.arc(0, 0, player.width / 4 + 4, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.lineWidth = 3;
  ctx.stroke(); // Draw engine thrusters

  ctx.beginPath();
  ctx.moveTo(-player.width / 4, player.height / 2 + 5);
  ctx.lineTo(-player.width / 3, player.height / 2 + 15);
  ctx.lineTo(-player.width / 6, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(player.width / 4, player.height / 2 + 5);
  ctx.lineTo(player.width / 3, player.height / 2 + 15);
  ctx.lineTo(player.width / 6, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill(); // Draw yellow thrust effects (flames)

  ctx.beginPath();
  ctx.moveTo(-player.width / 4, player.height / 2 + 10);
  ctx.lineTo(-player.width / 4 - 5, player.height / 2 + 30); // Flame end point

  ctx.lineTo(-player.width / 4 + 5, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 0, 0.7)"; // Semi-transparent yellow

  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(player.width / 4, player.height / 2 + 10);
  ctx.lineTo(player.width / 4 + 5, player.height / 2 + 30); // Flame end point

  ctx.lineTo(player.width / 4 - 5, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 0, 0.7)"; // Semi-transparent yellow

  ctx.fill();
  ctx.restore();
} // Function to draw player damage indicators with enhancements


function drawPlayerDamageIndicators() {
  var currentTime = Date.now();

  for (var _i3 = playerDamageIndicators.length - 1; _i3 >= 0; _i3--) {
    var indicator = playerDamageIndicators[_i3];
    var age = currentTime - indicator.creationTime;

    if (age > indicator.life) {
      // Remove the indicator after its life span
      playerDamageIndicators.splice(_i3, 1);
      continue;
    } // Calculate fade and rise effect


    var progress = age / indicator.life;
    indicator.opacity = 1 - progress; // Fades out over time

    indicator.y -= indicator.riseSpeed; // Rise over time
    // Set font size and opacity

    ctx.font = "".concat(indicator.fontSize, "px Arial");
    ctx.fillStyle = "rgba(".concat(indicator.color === "red" ? "255, 0, 0" : "255, 165, 0", ", ").concat(indicator.opacity, ")"); // Add a shadow for better readability

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4; // Draw the text

    ctx.fillText(indicator.text, indicator.x, indicator.y); // Remove shadow after drawing

    ctx.shadowBlur = 0;
  }
}

var highScoreKey = "highScore"; // Use a default high score for testing

var highScore = 6000; // Default value if no high score exists

function drawScoreAndCoins() {
  var marginTop = 60;
  var textColor = "white";
  var fontSize = "20px";
  var fontFamily = "Arial";
  ctx.fillStyle = textColor;
  ctx.font = "".concat(fontSize, " ").concat(fontFamily); // Add text shadow for better readability

  ctx.shadowColor = "black";
  ctx.shadowBlur = 4; // Round down score and high score to whole numbers

  var displayScore = Math.floor(score);
  var displayHighScore = Math.floor(highScore); // Draw the score

  ctx.fillText("Score: ".concat(displayScore), 10, marginTop); // Draw the coins

  ctx.fillText("Coins: ".concat(coins), 10, marginTop + 30); // Check if the current score exceeds the high score

  if (displayScore > displayHighScore) {
    highScore = displayScore; // Removed local storage saving functionality
  } // Draw the high score


  ctx.fillText("High Score: ".concat(displayHighScore), 10, marginTop + 60); // Draw the dollars with max capacity (if needed)
  // ctx.fillText(
  //   `Dollars: ${Math.min(dollars, maxDollars)} / ${maxDollars}`,
  //   10,
  //   marginTop + 90
  // );
  // Remove shadow for other drawings

  ctx.shadowColor = "transparent";
}

var startTime = Date.now(); // Timer start time
// Shield regeneration settings

var shieldRegenRate = 0.5; // Shield points regenerated per frame

var shieldRegenCooldown = 2000; // Time in ms before shield regeneration starts

var healthRegenRate = 1; // Health points regenerated per frame

var healthRegenCooldown = 4000; // Time in ms before health regeneration starts

var shieldLastUpdated = Date.now(); // Last time the shield was updated

var healthLastUpdated = Date.now(); // Last time the health was updated

var shieldBlink = false; // Flag for the blink effect

var blinkDuration = 500; // Duration of the blink effect in ms

var blinkStartTime = 0; // Start time of the blink effect

var healthBlink = false; // Flag for the health blink effect

var healthBlinkStartTime = 0; // Start time of the health blink effect

function drawPlayerHealth() {
  var x = 10;
  var marginTop = 20; // Add margin to the top

  var y = 10 + marginTop; // Adjust y position with the margin

  var width = 200;
  var height = 20;
  var maxHealth = 100;
  var maxShield = 35; // Assuming max shield is 35

  var currentHealth = Math.max(0, Math.min(player.health, maxHealth));
  var currentShield = Math.max(0, Math.min(player.shield, maxShield)); // Shield regeneration logic

  var currentTime = Date.now();

  if (currentTime - shieldLastUpdated > shieldRegenCooldown) {
    if (currentShield < maxShield) {
      currentShield = Math.min(currentShield + shieldRegenRate, maxShield);
      player.shield = currentShield; // Update player's shield

      shieldLastUpdated = currentTime; // Update last updated time
    }
  } // Health regeneration logic


  if (currentTime - healthLastUpdated > healthRegenCooldown) {
    if (currentHealth < maxHealth) {
      player.health = Math.min(currentHealth + healthRegenRate, maxHealth); // Update player's health

      healthLastUpdated = currentTime; // Update last updated time
    }
  } // Trigger shield blink effect if the shield is below 10% of maxShield


  if (currentShield < maxShield * 0.1 && !shieldBlink) {
    shieldBlink = true; // Start blinking

    blinkStartTime = currentTime; // Set blink start time
  } // Determine if the shield blink effect should be active


  var blinkActive = shieldBlink && currentTime - blinkStartTime < blinkDuration; // Trigger health blink effect if health is below 10% of maxHealth

  if (player.health < maxHealth * 0.1 && !healthBlink) {
    healthBlink = true; // Start health blinking

    healthBlinkStartTime = currentTime; // Set blink start time
  } // Determine if the health blink effect should be active


  var healthBlinkActive = healthBlink && currentTime - healthBlinkStartTime < blinkDuration;
  var healthWidth = player.health / maxHealth * width;
  var shieldWidth = currentShield / maxShield * healthWidth; // Shield bar inside the health bar
  // Draw the background of the health bar with a gradient

  var backgroundGradient = ctx.createLinearGradient(x, y, x + width, y);
  backgroundGradient.addColorStop(0, "darkred");
  backgroundGradient.addColorStop(1, "black");
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(x, y, width, height); // Draw the health bar with a gradient based on health

  var healthGradient = ctx.createLinearGradient(x, y, x + healthWidth, y);
  healthGradient.addColorStop(0, player.health > 50 ? "green" : "yellow");
  healthGradient.addColorStop(1, player.health > 50 ? "lightgreen" : "orange");
  ctx.fillStyle = healthGradient;
  ctx.fillRect(x, y, healthWidth, height); // Draw the shield bar on top, inside the health bar

  if (currentShield > 0) {
    ctx.fillStyle = blinkActive ? "cyan" : "blue"; // Change color to cyan if blinking

    ctx.fillRect(x, y, shieldWidth, height); // Shield width is based on the current health width
  } // Draw border around the health bar with shadow effect


  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height); // Draw a shadow effect on the border

  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 5;
  ctx.strokeRect(x, y, width, height);
  ctx.shadowBlur = 0; // Reset shadow
  // Draw health and shield text with a shadow for better readability

  ctx.fillStyle = healthBlinkActive ? "red" : "white"; // Change text color to red if blinking

  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top"; // Text shadow

  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 3;
  ctx.fillText("HP: ".concat(player.health, " / ").concat(maxHealth), x + 5, y + 5); // Draw shield text if the player has shield

  if (currentShield > 0) {
    ctx.fillText("Shield: ".concat(currentShield, " / ").concat(maxShield), x + 120, y + 5);
  } // Reset shadow


  ctx.shadowBlur = 0; // Reset the shield blink effect if the duration is over

  if (shieldBlink && currentTime - blinkStartTime >= blinkDuration) {
    shieldBlink = false; // Stop blinking
  } // Reset the health blink effect if the duration is over


  if (healthBlink && currentTime - healthBlinkStartTime >= blinkDuration) {
    healthBlink = false; // Stop blinking
  }
}

var batteryLevel = 100; // Example starting value, adjust as needed

var maxBatteryLevel = 100; // Maximum battery capacity

function drawBattery() {
  var x = 10; // X position for the battery display

  var y = 140; // Y position for the battery display

  var width = 200; // Width of the battery bar

  var height = 20; // Height of the battery bar

  var currentBattery = Math.max(0, Math.min(batteryLevel, maxBatteryLevel)); // Draw the background of the battery bar

  ctx.fillStyle = "darkgray";
  ctx.fillRect(x, y, width, height); // Draw the battery level

  var batteryWidth = currentBattery / maxBatteryLevel * width;
  ctx.fillStyle = currentBattery > 25 ? "green" : "red"; // Color based on battery level

  ctx.fillRect(x, y, batteryWidth, height); // Draw border around the battery bar

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height); // Draw battery text with a shadow for better readability

  ctx.fillStyle = "white"; // Color of the text

  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Battery: ".concat(currentBattery, " / ").concat(maxBatteryLevel), x + 5, y + 2);
}

function drawTimer() {
  var elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds

  var minutes = Math.floor(elapsedTime / 60); // Calculate minutes

  var seconds = elapsedTime % 60; // Calculate remaining seconds

  var timerText = "Time: ".concat(minutes, "m ").concat(seconds, "s"); // Measure text width

  ctx.font = "20px Arial";
  var textWidth = ctx.measureText(timerText).width; // Calculate position to center the text

  var timerX = (canvas.width - textWidth) / 2;
  var timerY = 40; // Clear previous timer area

  ctx.clearRect(timerX - 5, timerY - 5, textWidth + 10, 30); // Draw timer background

  ctx.fillStyle = "black";
  ctx.fillRect(timerX - 5, timerY - 5, textWidth + 10, 30); // Draw timer text

  ctx.fillStyle = "white";
  ctx.fillText(timerText, timerX, timerY);
} // Mouse control for player movement along the x-axis


canvas.addEventListener("mousemove", function (e) {
  var mouseX = e.clientX - canvas.getBoundingClientRect().left;
  player.x = mouseX - player.width / 2;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
});

function moveDamageIndicators() {
  var now = Date.now(); // Filter indicators by life span in a reusable function

  var filterByLife = function filterByLife(indicators) {
    return indicators.filter(function (indicator) {
      return now - indicator.creationTime < indicator.life;
    });
  }; // Apply the filter to both damage indicator arrays


  damageIndicators = filterByLife(damageIndicators);
  playerDamageIndicators = filterByLife(playerDamageIndicators);
} // Existing code


function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= playerSpeed;
  }

  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += playerSpeed;
  }
}

var keys = {};
document.addEventListener("keydown", function (e) {
  return keys[e.key] = true;
});
document.addEventListener("keyup", function (e) {
  return keys[e.key] = false;
}); // Allow shooting with space bar

document.addEventListener("keydown", function (e) {
  if (e.key === " ") {
    bullets.push({
      x: player.x + player.width / 2 - bulletWidth / 2,
      y: player.y
    });
  }
}); // Allow shooting with left mouse button

canvas.addEventListener("mousedown", function (e) {
  if (e.button === 0) {
    bullets.push({
      x: player.x + player.width / 2 - bulletWidth / 2,
      y: player.y
    });
  }
}); // Touch controls for player movement

canvas.addEventListener("touchstart", function (e) {
  e.preventDefault(); // Prevent default touch behavior

  handleTouchMovement(e);
});
canvas.addEventListener("touchmove", function (e) {
  e.preventDefault(); // Prevent default touch behavior

  handleTouchMovement(e);
});

function handleTouchMovement(e) {
  // Get touch coordinates
  var touchX = e.touches[0].clientX - canvas.offsetLeft;
  var touchY = e.touches[0].clientY - canvas.offsetTop; // Move player based on touch position

  if (touchX < canvas.width / 2) {
    // Touch on the left side of the screen
    if (player.x > 0) {
      player.x -= playerSpeed;
    }
  } else {
    // Touch on the right side of the screen
    if (player.x < canvas.width - player.width) {
      player.x += playerSpeed;
    }
  }
} // Touch controls for shooting


canvas.addEventListener("touchend", function (e) {
  e.preventDefault(); // Prevent default touch behavior
  // Add a bullet at the player's position when touch ends

  bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y
  });
});