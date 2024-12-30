"use strict";

var asteroidWidth = window.innerWidth < 768 ? 30 : 50; // Smaller width for mobile

var asteroidHeight = window.innerWidth < 768 ? 30 : 50; // Smaller height for mobile

var asteroidSpeed = 1.5;
var minDistance = 50; // Minimum distance between asteroids

var maxAsteroids = window.innerWidth < 768 ? 5 : 10; // Limit asteroids on mobile devices

var creationInterval = window.innerWidth < 768 ? 2000 : 1000; // Slower creation for mobile

var asteroids = []; // Initialize the asteroids array
// Array of asteroid types with their properties

var asteroidTypes = [{
  color: "grey",
  health: 3,
  speed: asteroidSpeed,
  size: 1
}, {
  color: "darkgrey",
  health: 5,
  speed: asteroidSpeed * 0.8,
  size: 1.2
}, {
  color: "red",
  health: 8,
  speed: asteroidSpeed * 0.6,
  size: 1.5
}, {
  color: "blue",
  health: 12,
  speed: asteroidSpeed * 1.1,
  size: 1.1
}];

function moveAsteroids() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = asteroids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var asteroid = _step.value;
      asteroid.y += asteroid.speed; // Remove off-screen asteroid

      if (asteroid.y > canvas.height) {
        asteroids.splice(asteroids.indexOf(asteroid), 1);
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
}

function drawAsteroids() {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = asteroids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var asteroid = _step2.value;
      ctx.save(); // Create a basic gradient effect for the asteroids

      var asteroidGradient = ctx.createRadialGradient(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2, asteroid.width / 4, asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2, asteroid.width / 2);
      asteroidGradient.addColorStop(0, asteroid.color);
      asteroidGradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = asteroidGradient;
      ctx.beginPath();
      ctx.arc(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2, asteroid.width / 2, 0, Math.PI * 2);
      ctx.fill();
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
}

function createAsteroid() {
  // Limit the number of asteroids on the screen
  if (asteroids.length >= maxAsteroids) {
    return;
  }

  var asteroidType = asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)];
  var newAsteroid = {
    x: Math.random() * (canvas.width - asteroidWidth),
    y: -asteroidHeight,
    // Start asteroid above the screen
    width: asteroidWidth * asteroidType.size,
    height: asteroidHeight * asteroidType.size,
    health: asteroidType.health,
    color: asteroidType.color,
    speed: asteroidType.speed
  }; // Check for minimum distance from existing asteroids

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = asteroids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var asteroid = _step3.value;
      var dx = newAsteroid.x - asteroid.x;
      var dy = newAsteroid.y - asteroid.y;
      var distance = Math.sqrt(dx * dx + dy * dy); // If the distance is less than the minimum, exit and do not add the new asteroid

      if (distance < minDistance) {
        return; // Exit the function if the new asteroid is too close
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  asteroids.push(newAsteroid);
} // Create asteroids at a regular interval


setInterval(createAsteroid, creationInterval);

function asteroidcollisions() {
  // Check for collision between player and asteroids
  for (var _i = 0, _asteroids = asteroids; _i < _asteroids.length; _i++) {
    var asteroid = _asteroids[_i];

    // Check collision between player and asteroid
    if (player.x < asteroid.x + asteroid.width && player.x + player.width > asteroid.x && player.y < asteroid.y + asteroid.height && player.y + player.height > asteroid.y) {
      // Base damage calculation for asteroids based on color
      var damage = 3; // Default damage for common asteroids
      // Set different base damage values based on asteroid color

      switch (asteroid.color) {
        case "grey":
          damage = 3; // Grey asteroids deal default damage

          break;

        case "darkgrey":
          damage = 2; // Dark grey asteroids deal less damage

          break;

        case "red":
          damage = 5; // Red asteroids deal more damage

          break;

        case "blue":
          damage = 4; // Blue asteroids deal medium damage

          break;

        default:
          damage = 3;
        // Default damage for any other color
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
      } // Remove the asteroid after the collision with the player


      asteroids.splice(asteroids.indexOf(asteroid), 1);
    } // Check for player health and trigger game over if necessary


    if (player.health <= 0) {
      displayGameOver();
    } // Remove asteroids that are out of the canvas


    asteroids = asteroids.filter(function (asteroid) {
      return asteroid.y < canvas.height;
    });
  }
}