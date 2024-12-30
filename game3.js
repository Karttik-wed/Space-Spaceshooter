// Configuration for star appearance
const starColors = [
  "blue",
  "lightpurple",
  "yellow",
  "purple",
  "red",
  "lightred",
  "white", // Added white for additional variation
  "cyan", // Added cyan for extra color
  "lightblue", // Added light blue for additional cool tones
  "pink", // Added pink for a warmer hue
];

let starCount = 300; // Number of stars to generate
const minDistance = 30; // Minimum distance between stars

// Adjust star count for device performance
if (navigator.hardwareConcurrency < 4) {
  // Check for low-end devices
  starCount = 150; // Reduce number of stars on low-end devices
}

// Array to store star elements
const stars = [];

// Function to create a star and position it in a circular pattern
function createStar() {
  const star = document.createElement("div");

  // Position stars in a circular pattern
  const radius = (Math.random() * window.innerWidth) / 2; // Random radius for each star
  const angle = Math.random() * 2 * Math.PI; // Random angle for each star
  const xPos = window.innerWidth / 2 + radius * Math.cos(angle);
  const yPos = window.innerHeight / 2 + radius * Math.sin(angle);

  const size = Math.random() * 4 + 2; // Star size (2px to 6px)
  const color = starColors[Math.floor(Math.random() * starColors.length)];
  const opacity = Math.random(); // Random opacity for blinking effect
  const blinkSpeed = Math.random() * 0.03 + 0.01; // Speed of blinking effect

  // Set star styles
  star.style.position = "absolute";
  star.style.left = `${xPos}px`;
  star.style.top = `${yPos}px`;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.backgroundColor = color;
  star.style.borderRadius = "50%";
  star.style.opacity = opacity;

  // Append the star to the body
  document.body.appendChild(star);

  // Store the star and its properties for animation
  stars.push({ element: star, opacity, blinkSpeed });
}

// Function to animate the stars (blinking effect)
function animateStars() {
  stars.forEach((star) => {
    // Update the opacity for smooth blinking effect
    star.opacity += star.blinkSpeed;
    if (star.opacity > 1 || star.opacity < 0) {
      star.blinkSpeed *= -1; // Reverse blinking direction when it hits limits
    }

    // Apply the new opacity with a smooth transition
    star.element.style.transition = "opacity 0.1s ease"; // Add transition for smoother opacity changes
    star.element.style.opacity = Math.abs(star.opacity);
  });

  // Continuously call animateStars for the next frame
  requestAnimationFrame(animateStars);
}

// Function to initialize the starry sky
function initializeStars() {
  for (let i = 0; i < starCount; i++) {
    createStar();
  }

  // Start animating the stars
  animateStars();
}

// Start the animation when the page is loaded
initializeStars();
