let damageIndicators = [];

function detectCollisions() {
  // Check if bullets hit enemies
  // Preload the collision sound
  const enemycollisionSound = new Audio("collision-sound.mp3");
  enemycollisionSound.volume = 0.2; // Set the volume to full (equivalent to 10 on a 0-10 scale)

  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (
        bullets[i].x < enemies[j].x + enemies[j].width &&
        bullets[i].x + bullets[i].width > enemies[j].x &&
        bullets[i].y < enemies[j].y + enemies[j].height &&
        bullets[i].y + bullets[i].height > enemies[j].y
      ) {
        // Apply initial bullet damage to the enemy
        enemies[j].health -= bullets[i].damage;

        // Create a floating damage indicator
        damageIndicators.push({
          x: enemies[j].x + enemies[j].width / 2,
          y: enemies[j].y + enemies[j].height / 2,
          text: bullets[i].damage,
          lifetime: 30, // How long the indicator lasts
          color: getRandomColor(), // Assign a random color
        });

        // 5% chance for the bullet to hit multiple times (adjust the chance as per your needs)
        let multiHitChance = Math.random() < 0.05; // 5% chance to trigger multiple hits

        if (multiHitChance) {
          let additionalHits = Math.floor(Math.random() * 8) + 5; // Additional 5-12 hits if multi-hit happens

          for (let hit = 0; hit < additionalHits; hit++) {
            // Apply additional damage to the enemy
            enemies[j].health -= bullets[i].damage;

            // Add additional damage indicators for each hit
            damageIndicators.push({
              x: enemies[j].x + enemies[j].width / 2,
              y: enemies[j].y + enemies[j].height / 2,
              text: bullets[i].damage,
              lifetime: 30,
              color: getRandomColor(),
            });
          }
        }

        // If the enemy's health is less than or equal to 0, remove it
        if (enemies[j].health <= 0) {
          enemies.splice(j, 1);
          score += 10; // Increment the score
          coins += 1; // Increment coins by 1 for each enemy destroyed
          j--; // Adjust index after removal
        }

        // Play the collision sound when a bullet hits an enemy
        enemycollisionSound.play();

        // Remove the bullet after collision
        bullets.splice(i, 1);
        i--; // Adjust index after removal
        break;
      }
    }
  }

  // Preload the collision sound
  const collisionSound = new Audio("collision-sound.mp3");
  collisionSound.volume = 0.2; // Set the volume to 20%

  for (let i = 0; i < enemies.length; i++) {
    // Check for collision with the player
    if (
      player.x < enemies[i].x + enemies[i].width &&
      player.x + player.width > enemies[i].x &&
      player.y < enemies[i].y + enemies[i].height &&
      player.y + player.height > enemies[i].y
    ) {
      let damage = 2; // Default base damage value

      // Check for specific enemy colors and set damage accordingly
      if (enemies[i].color === "grey") {
        damage = 3; // Big grey enemy deals 3 damage
        player.isFrozen = true; // Freeze the player when hit by a grey enemy

        // Set a timeout for the freeze duration (5 seconds)
        // setTimeout(() => {
        // player.isFrozen = false; // Unfreeze the player after 5 seconds
        // }, 5000);
      } else if (enemies[i].color === "white") {
        damage = 4; // White enemies deal 4 damage
      } else if (enemies[i].color === "silver") {
        damage = 6; // Silver enemies deal 6 damage
      } else if (enemies[i].color === "orange") {
        damage = 5; // Orange enemies deal 5 damage
        // Additional effect for explosive orange enemy can be added here if needed
      } else {
        // Regular enemies have random chance for a critical hit
        const critChance = Math.random() * 100; // Random number between 0 and 100

        // Check if it's a critical hit (7% to 22% or 24.6%)
        if (critChance >= 7 && critChance <= 22) {
          damage *= 2; // Double the damage for a critical hit
        }
      }

      // Reduce player health when hit by enemy
      player.health -= damage;

      // Trigger damage effect for the player
      triggerDamageEffect();

      // Create a floating damage indicator for the player
      damageIndicators.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        text: damage, // Updated damage value (critical or base)
        lifetime: 30,
        color: getRandomColor(),
      });

      // Play the collision sound
      collisionSound.play();

      // Remove enemy when it hits the player
      enemies.splice(i, 1);
      i--; // Adjust index after removal
    }
  }

  // Check if bomb explosion hits enemies
  const currentTime = Date.now();
  if (currentTime - lastBombTime < 200) {
    // Check if the bomb is still "active"
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
        // Apply bomb damage to the enemy
        enemy.health -= 7;

        // Create a floating damage indicator for the bomb
        damageIndicators.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          text: 7, // bomb damage
          lifetime: 30,
        });

        // If the enemy's health is less than or equal to 0, remove it
        if (enemy.health <= 0) {
          enemies.splice(i, 1);
          score += 10; // Increment the score
          coins += 1; // Increment coins
          i--; // Adjust index after removal
        }
      }
    }

    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (
          bullets[i].x < enemies[j].x + enemies[j].width &&
          bullets[i].x + bullets[i].width > enemies[j].x &&
          bullets[i].y < enemies[j].y + enemies[j].height &&
          bullets[i].y + bullets[i].height > enemies[j].y
        ) {
          // Apply initial bullet damage to the enemy
          enemies[j].health -= bullets[i].damage;

          // Check if this is an ice gun bullet
          if (bullets[i].type === "ice") {
            // Apply slowdown effect to the enemy (e.g., reduce speed)
            enemies[j].speed *= iceGunSlowdownEffect; // Reduce enemy speed by 50%

            // Optional: Create a visual effect to indicate slowdown
            damageIndicators.push({
              x: enemies[j].x + enemies[j].width / 2,
              y: enemies[j].y + enemies[j].height / 2,
              text: "Frozen", // Indicate that the enemy is frozen
              lifetime: 30,
              color: "blue", // Blue for ice
            });
          }

          // Remove the bullet after collision
          bullets.splice(i, 1);
          i--; // Adjust index after removal
          break;
        }
      }
    }
  }

  // Update floating damage indicators (move them upwards and reduce their lifetime)
  for (let i = 0; i < damageIndicators.length; i++) {
    damageIndicators[i].y -= 1; // Move the indicator upwards
    damageIndicators[i].lifetime--; // Decrease lifetime
    if (damageIndicators[i].lifetime <= 0) {
      damageIndicators.splice(i, 1); // Remove the indicator once its lifetime is over
      i--; // Adjust index after removal
    }
  }
}

const enemycollisionSound = new Audio("collision-sound.mp3");
enemycollisionSound.volume = 0.2; // Set the volume to full (equivalent to 10 on a 0-10 scale)

// Missile collision logic
function checkMissileCollisions() {
  for (let i = 0; i < missiles.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (
        missiles[i].x < enemies[j].x + enemies[j].width &&
        missiles[i].x + missiles[i].width > enemies[j].x &&
        missiles[i].y < enemies[j].y + enemies[j].height &&
        missiles[i].y + missiles[i].height > enemies[j].y
      ) {
        // Apply missile damage to the enemy
        enemies[j].health -= missiles[i].damage;

        // Create a floating damage indicator
        damageIndicators.push({
          x: enemies[j].x + enemies[j].width / 2,
          y: enemies[j].y + enemies[j].height / 2,
          text: missiles[i].damage,
          lifetime: 30, // How long the indicator lasts
          color: getRandomColor(), // Assign a random color
        });

        // If the enemy's health is less than or equal to 0, remove it
        if (enemies[j].health <= 0) {
          enemies.splice(j, 1);
          score += 20; // Increment the score
          coins += 9; // Increment coins by 1 for each enemy destroyed
          j--; // Adjust index after removal
        }

        // Play the collision sound when a missile hits an enemy
        enemycollisionSound.play();

        // Remove the missile after collision
        missiles.splice(i, 1);
        i--; // Adjust index after removal
        break;
      }
    }
  }
}

function getRandomColor() {
  const colors = [
    { color: "red", weight: 25 },
    { color: "orange", weight: 13 },
    { color: "yellow", weight: 14 },
    { color: "#FFFFE0", weight: 25 }, // Light yellow
    { color: "#FFA07A", weight: 33 }, // Light orange
  ];

  const totalWeight = colors.reduce((sum, entry) => sum + entry.weight, 0);
  const randomNum = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const entry of colors) {
    cumulativeWeight += entry.weight;
    if (randomNum <= cumulativeWeight) {
      return entry.color;
    }
  }
}

// Function to draw the damage indicators
function drawDamageIndicators() {
  for (let i = 0; i < damageIndicators.length; i++) {
    ctx.fillStyle = damageIndicators[i].color; // Use the assigned color
    ctx.font = "20px Arial";
    ctx.fillText(
      damageIndicators[i].text,
      damageIndicators[i].x,
      damageIndicators[i].y
    );
  }
}
