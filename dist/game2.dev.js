"use strict";

var destroyedEnemiesCount = 0; // Counter for destroyed enemies

var bulletSpeed = 8;
var bulletWidth = 5;
var bulletHeight = 20;
var normalScoreIncrement = 10; // Base score increment for defeating an enemy
// Function to handle bullet movement and collisions

function moveBullets() {
  bullets.forEach(function (bullet) {
    bullet.y -= bulletSpeed;
  });
  fireballs.forEach(function (fireball) {
    fireball.y -= fireballSpeed;
  });

  for (var i = bullets.length - 1; i >= 0; i--) {
    var bullet = bullets[i];
    if (!bullet) continue; // Skip if bullet is undefined or null

    for (var j = enemies.length - 1; j >= 0; j--) {
      var enemy = enemies[j];
      if (!enemy) continue; // Skip if enemy is undefined or null

      if (bullet.x < enemy.x + enemy.width && bullet.x + bulletWidth > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + bulletHeight > enemy.y) {
        var dx = bullet.x - (enemy.x + enemy.width / 2);
        var dy = bullet.y - (enemy.y + enemy.height / 2);
        var distance = Math.sqrt(dx * dx + dy * dy); // Ensure minimum distance of 1

        var minDistance = 1;
        var maxDistance = 250 * 1.05; // Increased by 5%

        var distanceFactor = Math.max(0, (distance - minDistance) / (maxDistance - minDistance));
        var baseDamage = 0.6 * 1.05; // Increased by 5%

        var minDamage = 0.45 * 1.05; // Increased by 5%

        var damage = baseDamage * distanceFactor + minDamage * (1 - distanceFactor); // Critical hit range adjustment

        var shortRangeThreshold = 125 * 1.05; // Increased by 5%

        if (distance <= shortRangeThreshold) {
          var minMultiplier = 0.5 * 1.05; // Increased by 5%

          var maxMultiplier = 1.0 * 1.05; // Increased by 5%

          var randomMultiplier = Math.random() * (maxMultiplier - minMultiplier) + minMultiplier;
          damage *= randomMultiplier;
        } // Critical hit calculation


        var criticalChance = 0.2 * 1.05; // Increased by 5%

        var criticalMultiplierMin = 0.5 * 1.05; // Increased by 5%

        var criticalMultiplierMax = 1.0 * 1.05; // Increased by 5%

        var baseCriticalDamage = 0.9 * 1.05; // Increased by 5%

        var additionalDamageChance = 0.05 * 1.05; // Increased by 5%

        var additionalDamagePercentage = 0.03 * 1.05; // Increased by 5%

        var isCriticalHit = Math.random() < criticalChance;

        if (isCriticalHit) {
          var criticalMultiplier = Math.random() * (criticalMultiplierMax - criticalMultiplierMin) + criticalMultiplierMin;
          damage = (damage + baseCriticalDamage) * criticalMultiplier;
        }

        var isAdditionalDamage = Math.random() < additionalDamageChance;

        if (isAdditionalDamage) {
          damage += damage * additionalDamagePercentage;
        }

        enemy.health -= damage;
        var enemyScore = 0;
        var enemyCoins = 0;

        switch (enemy.type) {
          case "yellow":
            enemyScore = Math.floor(50 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(10 * 1.05); // Increased by 5% and floored

            break;

          case "blue":
            enemyScore = Math.floor(75 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(15 * 1.05); // Increased by 5% and floored

            break;

          case "green":
            enemyScore = Math.floor(100 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(20 * 1.05); // Increased by 5% and floored

            break;

          case "purple":
            enemyScore = Math.floor(150 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(30 * 1.05); // Increased by 5% and floored

            break;

          case "orange":
            enemyScore = Math.floor(120 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(25 * 1.05); // Increased by 5% and floored

            break;

          case "red":
            // New case for red enemies
            enemyScore = Math.floor(200 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(40 * 1.05); // Increased by 5% and floored

            break;

          default:
            enemyScore = Math.floor(50 * 1.05); // Increased by 5% and floored

            enemyCoins = Math.floor(10 * 1.05); // Increased by 5% and floored

            break;
        }

        if (enemy.health <= 0) {
          enemies.splice(j, 1);
          score += enemyScore;
          coins += enemyCoins;
        }

        damageIndicators.push({
          x: enemy.x + enemy.width / 2 - 10,
          y: enemy.y + enemy.height / 2 - 10,
          text: isCriticalHit ? "-".concat(damage.toFixed(1), " CRIT") : "-".concat(damage.toFixed(1)),
          color: isCriticalHit ? "#FF6347" : "white",
          creationTime: Date.now(),
          life: isCriticalHit ? 800 * 1.05 : 500 * 1.05,
          // Increased by 5%
          fontSize: isCriticalHit ? 26 * 1.05 : 20 * 1.05,
          // Increased by 5%
          opacity: 1,
          riseSpeed: 0.5
        });
        bullets.splice(i, 1);
        break;
      }
    } // Fireball Collision Detection


    var _loop = function _loop(_i) {
      var fireball = fireballs[_i];
      if (!fireball) return "continue";

      var _loop3 = function _loop3(_j) {
        var enemy = enemies[_j];
        if (!enemy) return "continue";

        if (fireball.x < enemy.x + enemy.width && fireball.x + fireball.width > enemy.x && fireball.y < enemy.y + enemy.height && fireball.y + fireball.height > enemy.y) {
          // Calculate distance between fireball and enemy
          var fireballCenterX = fireball.x + fireball.width / 2;
          var fireballCenterY = fireball.y + fireball.height / 2;
          var enemyCenterX = enemy.x + enemy.width / 2;
          var enemyCenterY = enemy.y + enemy.height / 2;

          var _dx = fireballCenterX - enemyCenterX;

          var _dy = fireballCenterY - enemyCenterY;

          var _distance3 = Math.sqrt(_dx * _dx + _dy * _dy); // Define short range and long range thresholds


          var _shortRangeThreshold2 = 50; // Example threshold for short range

          var longRangeThreshold = 150; // Example threshold for long range
          // Randomly reduce the base damage by 5% to 10%

          var _baseDamage2 = 1.0;
          var damageReductionFactor = 0.95 + Math.random() * 0.05; // Random factor between 0.95 and 1.00

          var fireballDamage = _baseDamage2 * damageReductionFactor; // Apply range-based damage modifier

          if (_distance3 <= _shortRangeThreshold2) {
            // Short range: increase damage by 25%
            fireballDamage *= 1.25;
          } else if (_distance3 >= longRangeThreshold) {
            // Long range: decrease damage by 25%
            fireballDamage *= 0.75;
          } // Apply critical hit chance


          var _criticalChance = 0.1; // 10% chance for critical hit

          var _criticalMultiplierMin = 1.1;
          var _criticalMultiplierMax = 1.2; // Reduced critical multiplier max

          var maxCriticalMultiplier = 1.3; // Reduced maximum critical multiplier cap

          var _isCriticalHit2 = Math.random() < _criticalChance;

          if (_isCriticalHit2) {
            var _criticalMultiplier = Math.random() * (_criticalMultiplierMax - _criticalMultiplierMin) + _criticalMultiplierMin;

            fireballDamage *= Math.min(_criticalMultiplier, maxCriticalMultiplier); // Cap critical multiplier
          } // Apply 2% extra damage


          var extraDamagePercentage = 0.02;
          fireballDamage += fireballDamage * extraDamagePercentage; // Increase total damage by 3%

          fireballDamage *= 1.03; // Add damage indicator for critical hit

          damageIndicators.push({
            x: enemy.x + enemy.width / 2 - 10,
            y: enemy.y + enemy.height / 2 - 10,
            text: _isCriticalHit2 ? "-".concat(fireballDamage.toFixed(1), " CRIT") : "-".concat(fireballDamage.toFixed(1)),
            color: _isCriticalHit2 ? "red" : "orange",
            creationTime: Date.now(),
            life: _isCriticalHit2 ? 600 : 500,
            // Duration of the damage indicator
            fontSize: _isCriticalHit2 ? 22 : 18,
            // Font size for critical hits
            opacity: 1,
            riseSpeed: 0.4 // Rise speed of the damage indicator

          }); // Apply fireball damage to the main enemy

          enemy.health -= fireballDamage;

          if (enemy.health <= 0) {
            enemies.splice(_j, 1);
            score += 60; // Reduced score for kill

            coins += 50; // Reduced coin reward for kill
          }

          var splashRadius = 30; // Reduced radius for splash damage
          // Apply splash damage to nearby enemies

          enemies.forEach(function (otherEnemy) {
            var dx = fireball.x - (otherEnemy.x + otherEnemy.width / 2);
            var dy = fireball.y - (otherEnemy.y + otherEnemy.height / 2);
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= splashRadius) {
              // Calculate splash damage
              var splashDamage = fireballDamage * (1 - distance / splashRadius); // Splash damage scales with distance
              // Increase splash damage by 2%

              splashDamage *= 1.02;
              otherEnemy.health -= splashDamage; // Add damage indicator for splash

              damageIndicators.push({
                x: otherEnemy.x + otherEnemy.width / 2 - 10,
                y: otherEnemy.y + otherEnemy.height / 2 - 10,
                text: "-".concat(splashDamage.toFixed(1)),
                color: "orange",
                creationTime: Date.now(),
                life: 800,
                // Duration of splash damage indicator
                fontSize: 16,
                // Font size for splash damage
                opacity: 1,
                riseSpeed: 0.4
              });

              if (otherEnemy.health <= 0) {
                enemies.splice(enemies.indexOf(otherEnemy), 1);
                score += 15; // Reduced score for splash kill

                coins += 2; // Reduced coin reward for splash kill
              }
            }
          }); // Apply burning effect (damage over time)

          var burningChanceMin = 0.05; // Minimum chance of burning effect

          var burningChanceMax = 0.1; // Maximum chance of burning effect
          // Generate a random chance between 0 and 1

          var randomChance = Math.random();

          if (randomChance >= 1 - burningChanceMax && randomChance < 1 - burningChanceMin) {
            var burningDuration = 1500; // Reduced duration of 1.5 seconds

            var burningDamage = 6; // Reduced total burning damage

            var numBurnTicks = 3; // Reduced number of ticks

            var burnInterval = burningDuration / numBurnTicks; // Interval between ticks

            var tickDamage = burningDamage / numBurnTicks; // Damage per tick

            if (!enemy.burning) {
              enemy.burning = true;
              enemy.burnTicks = 0;
              enemy.burnInterval = setInterval(function () {
                if (enemy.burnTicks < numBurnTicks) {
                  enemy.health -= tickDamage;
                  damageIndicators.push({
                    x: enemy.x + enemy.width / 2 - 10,
                    y: enemy.y + enemy.height / 2 - 10,
                    text: "-".concat(tickDamage.toFixed(1), " BURN"),
                    color: "orange",
                    creationTime: Date.now(),
                    life: 300,
                    // Duration of the damage indicator
                    fontSize: 16,
                    opacity: 1,
                    riseSpeed: 0.4
                  });
                  enemy.burnTicks += 1;
                } else {
                  clearInterval(enemy.burnInterval);
                  enemy.burning = false;
                }
              }, burnInterval);
            }
          }

          fireballs.splice(_i, 1);
          return "break";
        }
      };

      _loop2: for (var _j = enemies.length - 1; _j >= 0; _j--) {
        var _ret2 = _loop3(_j);

        switch (_ret2) {
          case "continue":
            continue;

          case "break":
            break _loop2;
        }
      }
    };

    for (var _i = fireballs.length - 1; _i >= 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "continue") continue;
    } // Check collision with asteroids


    var shortRange = 100; // Define short range threshold

    var mediumRange = 150; // Define medium range threshold

    var longRange = 200; // Define long range threshold
    // Ensure bullet and asteroids are defined

    if (!bullet || !asteroids) return; // Variable to keep track of the largest asteroid

    var largestAsteroid = null; // Set bullet accuracy (0 to 1, where 1 is 100% accuracy)

    var bulletAccuracy = 0.5; // Set accuracy to 50%
    // Iterate through asteroids in reverse order for safe removal

    for (var k = asteroids.length - 1; k >= 0; k--) {
      var asteroid = asteroids[k];
      if (!asteroid) continue; // Skip if asteroid is undefined or null
      // Update largest asteroid if current asteroid is larger

      if (!largestAsteroid || asteroid.width * asteroid.height > largestAsteroid.width * largestAsteroid.height) {
        largestAsteroid = asteroid;
      } // Collision detection between bullet and asteroid


      var collisionDetected = bullet.x < asteroid.x + asteroid.width && bullet.x + bulletWidth > asteroid.x && bullet.y < asteroid.y + asteroid.height && bullet.y + bulletHeight > asteroid.y;

      if (collisionDetected) {
        // Calculate distance between bullet and asteroid
        var _distance = Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y);

        var _baseDamage = 1.0; // Base damage for calculations

        var _isCriticalHit = false; // Track if the hit is critical
        // Determine damage modifications based on distance

        if (_distance <= shortRange) {
          _baseDamage *= 2.0; // 100% increase for short range

          bullet.recoil = 10; // Increased recoil for short range

          _isCriticalHit = Math.random() < 0.25; // 25% chance for critical hit
        } else if (_distance <= mediumRange) {
          _baseDamage *= 1.2; // 20% increase for medium range

          bullet.recoil = 5; // Moderate recoil for medium range
        } else if (_distance <= longRange) {
          _baseDamage *= 1.0; // No increase for long range

          bullet.recoil = 2; // Minimal recoil for long range
        } else {
          _baseDamage *= 0.5; // Decrease damage by 50% for distances beyond long range

          bullet.recoil = 2; // Minimal recoil for distances beyond long range
        } // Apply critical hit if applicable


        if (_isCriticalHit) {
          _baseDamage *= 2.0; // Double the damage for a critical hit
        } // Apply 20% decrease to all damage


        _baseDamage *= 0.8; // Decrease damage by 20%
        // Adjust damage based on bullet accuracy

        var accuracyFactor = Math.random() < bulletAccuracy ? 1 : 0; // Hit chance; if miss, set damage to 0

        _baseDamage *= accuracyFactor; // Apply accuracy factor
        // Apply calculated damage to the asteroid's health

        asteroid.health -= _baseDamage; // Create damage indicator

        var damageColor = asteroid.health <= 0 ? "yellow" : "white"; // Color based on asteroid health

        var damageIndicator = {
          x: asteroid.x + asteroid.width / 2 - 10,
          // Centering the indicator
          y: asteroid.y + asteroid.height / 2 - 10,
          text: "-".concat(Math.round(_baseDamage)),
          // Display rounded damage dealt
          color: _isCriticalHit ? "yellow" : damageColor,
          // Yellow for critical hits
          creationTime: Date.now(),
          life: 500,
          // Duration of the damage indicator
          fontSize: 22,
          // Intended size
          opacity: 1,
          riseSpeed: 0.4
        };
        damageIndicators.push(damageIndicator); // Add the indicator to the array
        // Remove the asteroid if health is zero or below

        if (asteroid.health <= 0) {
          asteroids.splice(k, 1);
        } // Remove the bullet (assuming `i` is defined correctly elsewhere in your code)


        bullets.splice(i, 1); // Remove the bullet

        break; // Exit the loop after handling the collision
      }
    } /// fire balls


    for (var _i2 = fireballs.length - 1; _i2 >= 0; _i2--) {
      var fireball = fireballs[_i2];
      if (!fireball) continue;

      for (var _k = asteroids.length - 1; _k >= 0; _k--) {
        var _asteroid = asteroids[_k];
        if (!_asteroid) continue; // Check for collision

        if (fireball.x < _asteroid.x + _asteroid.width && fireball.x + fireball.width > _asteroid.x && fireball.y < _asteroid.y + _asteroid.height && fireball.y + fireball.height > _asteroid.y) {
          // 70% accuracy check
          if (Math.random() > 0.3) {
            // Fireball hits
            // Random base damage between 0.8 and 2
            var baseAsteroidDamage = 0.9 + Math.random() * (2 - 0.8);
            var damageIncreaseFactor = 1.1 + 0.54; // 54% increase

            var asteroidDamage = baseAsteroidDamage * damageIncreaseFactor; // Increase damage by 20%

            asteroidDamage *= 1.2; // Check distance for short-range bonus

            var _shortRangeThreshold = 50; // Adjust this value as needed

            var _distance2 = Math.sqrt(Math.pow(fireball.x - _asteroid.x, 2) + Math.pow(fireball.y - _asteroid.y, 2)); // Apply damage scaling based on distance


            if (_distance2 < _shortRangeThreshold) {
              asteroidDamage *= 0.7; // Reduce damage by 25% for short-range

              asteroidDamage *= 1.04; // Optional: Apply an additional bonus if needed
            } else {
              asteroidDamage *= 0.82; // Reduce damage by 15% for long-range
            } // Normal damage indicator


            damageIndicators.push({
              x: _asteroid.x + _asteroid.width / 2 - 10,
              y: _asteroid.y + _asteroid.height / 2 - 10,
              text: -"".concat((baseAsteroidDamage * damageIncreaseFactor).toFixed(1)),
              // Display base damage without extra
              color: "yellow",
              // Color for normal damage
              creationTime: Date.now(),
              life: 500,
              // Duration of the damage indicator
              fontSize: 22,
              // Ensure this is the intended size
              opacity: 1,
              riseSpeed: 0.4
            }); // Apply additional damage increase

            var regularDamageIncreaseFactor = 1 + (0.12 + Math.random() * 0.03); // Random between 15% and 18%

            asteroidDamage *= regularDamageIncreaseFactor; // Apply damage to the asteroid only if there's damage

            if (asteroidDamage > 0) {
              _asteroid.health -= asteroidDamage;

              if (_asteroid.health <= 0) {
                asteroids.splice(_k, 1); // Remove asteroid from array

                score += 50; // Example score for destroying an asteroid

                coins += 23; // Example coin reward for destroying an asteroid
              }
            }
          } else {
            // Fireball misses (30% chance)
            damageIndicators.push({
              x: fireball.x + fireball.width / 2 - 10,
              y: fireball.y - 20,
              text: "Miss!",
              color: "red",
              creationTime: Date.now(),
              life: 500,
              fontSize: 22,
              opacity: 1,
              riseSpeed: 0.4
            });
          }

          fireballs.splice(_i2, 1); // Remove fireball after collision or miss

          break; // Exit loop since fireball is removed
        }
      }
    }
  }
} // Function to draw bullets


function drawBullets() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = bullets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var bullet = _step.value;

      // Draw bullets for left, center, and right
      for (var _i3 = 0, _arr = [-bulletWidth, 0, bulletWidth]; _i3 < _arr.length; _i3++) {
        var offset = _arr[_i3];
        // Added 0 for the center bullet
        // Draw the bullet body
        var mainColor = bullet.color || "red"; // Allow different bullet colors

        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(bullet.x + offset - bulletWidth, bullet.y);
        ctx.lineTo(bullet.x + offset, bullet.y - bulletHeight / 2);
        ctx.lineTo(bullet.x + offset + bulletWidth, bullet.y);
        ctx.lineTo(bullet.x + offset, bullet.y + bulletHeight / 1.5);
        ctx.closePath();
        ctx.fill(); // Add a metallic shine

        var shineGradient = ctx.createLinearGradient(bullet.x + offset - bulletWidth, bullet.y, bullet.x + offset + bulletWidth, bullet.y);
        shineGradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        shineGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        shineGradient.addColorStop(1, "rgba(255, 255, 255, 0.7)");
        ctx.fillStyle = shineGradient;
        ctx.fill(); // Add a powerful glowing effect

        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(255, 100, 0, 0.8)";
        ctx.fillStyle = "rgba(255, 200, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(bullet.x + offset, bullet.y, bulletWidth * 0.8, 0, Math.PI * 2);
        ctx.fill(); // Add pulsating energy core

        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.fillStyle = "rgba(255, 255, 255, " + (0.5 + Math.sin(Date.now() * 0.01) * 0.3) + ")";
        ctx.beginPath();
        ctx.arc(bullet.x + offset, bullet.y, bulletWidth / 2.5, 0, Math.PI * 2);
        ctx.fill(); // Draw bullet tail

        ctx.shadowBlur = 0; // No shadow for the tail

        ctx.strokeStyle = "rgba(255, 200, 0, 0.5)"; // Tail color

        ctx.lineWidth = bulletWidth; // Tail width

        ctx.beginPath();
        ctx.moveTo(bullet.x + offset, bullet.y);
        ctx.lineTo(bullet.x + offset - bullet.vx * 5, bullet.y - bullet.vy * 5); // Tail length

        ctx.stroke(); // Add trailing sparks for a more dynamic look

        ctx.fillStyle = "rgba(255, 200, 0, 0.8)";

        for (var i = 0; i < 3; i++) {
          var sparkX = bullet.x + offset - bullet.vx * (i + 1) * 3;
          var sparkY = bullet.y - bullet.vy * (i + 1) * 3;
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, bulletWidth / 3, 0, Math.PI * 2);
          ctx.fill();
        } // Add subtle heat distortion (optional)


        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(255, 140, 0, 0.3)";
        ctx.fillStyle = "rgba(255, 140, 0, 0.4)";
        ctx.beginPath();
        ctx.arc(bullet.x + offset, bullet.y, bulletWidth, 0, Math.PI * 2);
        ctx.fill();
      } // Reset shadow effects


      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
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

var fireballs = [];
var fireballWidth = 25;
var fireballHeight = 25; // Listen for 'z' key to fire fireballs

document.addEventListener("keydown", function (e) {
  if (e.key === "z") {
    fireballs.push({
      x: player.x + player.width / 2 - fireballWidth / 2,
      y: player.y,
      width: fireballWidth,
      height: fireballHeight
    });
  }
});
var fireballSpeed = 2; // Custom speed for fireballs

function moveFireballs() {
  // Move all fireballs at the custom speed
  fireballs.forEach(function (fireball) {
    fireball.y -= fireballSpeed; // Fireballs move upwards
  }); // Remove fireballs that go off-screen

  for (var i = fireballs.length - 1; i >= 0; i--) {
    if (fireballs[i].y + fireballHeight < 0) {
      fireballs.splice(i, 1); // Remove fireball if it goes off-screen
    }
  }
}

function drawFireballs() {
  fireballs.forEach(function (fireball) {
    // Draw the fireball
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(fireball.x + fireball.width / 2, fireball.y + fireball.height / 2, fireballWidth / 2, 0, Math.PI * 2);
    ctx.fill(); // Add a glowing effect

    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 69, 0, 0.8)";
    ctx.fillStyle = "rgba(255, 140, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(fireball.x + fireball.width / 2, fireball.y + fireball.height / 2, fireballWidth * 0.8, 0, Math.PI * 2);
    ctx.fill(); // Reset shadow effects

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  });
}

function checkCollisions() {
  moveBullets();
  moveEnemies();
  moveDamageIndicators();
}

function update(timestamp) {
  if (!lastSpawnTime) lastSpawnTime = timestamp;
  var deltaTime = timestamp - lastSpawnTime;

  if (deltaTime > spawnInterval) {
    createEnemy();
    lastSpawnTime = timestamp;
  } // Reset player hit effect after 200ms


  if (player.isHit && Date.now() - player.hitTime > 200) {
    player.isHit = false;
  }

  movePlayer(); // Moving player (keyboard)

  checkCollisions();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawTimer(); // Draw the timer

  spawnEnemies(); // Call to spawn enemies

  moveFireballs(); // Add this line

  drawFireballs(); // Add this line

  drawDamageIndicators();
  drawPlayerDamageIndicators();
  drawScoreAndCoins();
  drawPlayerHealth();
  requestAnimationFrame(update);
  drawBattery();
  moveAsteroids(); // Move the asteroids

  drawAsteroids(); // Draw the asteroids

  asteroidcollisions();
  requestAnimationFrame(gameLoop); // Continue the loop
}

update();