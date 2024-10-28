const game = document.getElementById('game');
const spaceship = document.getElementById('spaceship');
const lifeBar = document.getElementById('life');
const wordInput = document.getElementById('wordInput');
const correctWordsEl = document.getElementById('correctWords');
const incorrectWordsEl = document.getElementById('incorrectWords');
const levelEl = document.getElementById('level');

const words = ["color", "border", "padding", "margin", "display", "flex", "grid", "justify", "align", "background"];
const doubleWords = ["display flex", "justify content", "align items", "grid template", "color scheme"];
let life = 100;
let correctWords = 0;
let incorrectWords = 0;
let level = 1;
let gamePaused = false;
let asteroidSpeed = 16;
let asteroids = [];

function createAsteroid() {
  const asteroid = document.createElement('div');
  asteroid.classList.add('asteroid');

  const isDoubleWord = Math.random() < 0.2;
  asteroid.textContent = isDoubleWord 
    ? doubleWords[Math.floor(Math.random() * doubleWords.length)] 
    : words[Math.floor(Math.random() * words.length)];
  
  asteroid.style.left = `${Math.floor(Math.random() * (game.clientWidth - 50))}px`;
  asteroid.style.top = '0px';

  game.appendChild(asteroid);
  asteroids.push(asteroid);
}

function spawnAsteroids() {
  if (!gamePaused && asteroids.length < 3 && correctWords < level * 50) {
    while (asteroids.length < 3 && correctWords < level * 50) {
      createAsteroid();
    }
  }

}

function updateAsteroids() {
  if (gamePaused) return;

  asteroids.forEach((asteroid, index) => {
    const currentTop = parseInt(window.getComputedStyle(asteroid).top);
    asteroid.style.top = `${currentTop + asteroidSpeed}px`;

    if (currentTop >= spaceship.offsetTop) {
      life -= 20;
      updateLife();
      asteroid.remove();
      asteroids.splice(index, 1);
      incorrectWords++;
      updateStats();
    }
  });

  spawnAsteroids();
}

function updateLife() {
  life = Math.max(0, life);
  lifeBar.style.width = `${life}%`;

  if (life <= 25) {
    lifeBar.classList.add("lifeLow25");
    lifeBar.classList.remove("lifeLow50");
  } else if (life <= 50) {
    lifeBar.classList.add("lifeLow50");
    lifeBar.classList.remove("lifeLow25");
  } else {
    lifeBar.classList.remove("lifeLow25", "lifeLow50");
    lifeBar.style.backgroundColor = life > 75 ? "green" : "yellow";
  }

  if (life <= 0) {
    alert("Game Over!");
    location.reload();
  }
}

function updateStats() {
  correctWordsEl.textContent = correctWords;
  incorrectWordsEl.textContent = incorrectWords;
  levelEl.textContent = level;

  if (correctWords > 0 && correctWords % 50 === 0) {
    level++;
    asteroidSpeed += 16;
    alert(`Congratulations, you have reached level: ${level}!`);

    asteroids.forEach(asteroid => asteroid.remove());
    asteroids = [];
    spawnAsteroids();
  }
}

function checkWord(event) {
  if (event.key === 'Enter') {
    const inputWord = wordInput.value.trim();
    wordInput.value = '';
    let matched = false;

    asteroids.forEach((asteroid, index) => {
      if (asteroid.textContent === inputWord) {
        asteroid.remove();
        asteroids.splice(index, 1);
        correctWords++;
        matched = true;

        if (doubleWords.includes(inputWord)) {
          life = Math.min(100, life + inputWord.length);
          updateLife();
        }

        updateStats();
      }
    });

    if (!matched) {
      const damage = inputWord.length;
      life -= damage;
      incorrectWords++;
      updateStats();
      updateLife();
    }
  } else if (event.key === ' ') {
    gamePaused = !gamePaused;
  }

  spawnAsteroids();
}

function gameLoop() {
  if (!gamePaused) {
    updateAsteroids();
  }
  setTimeout(gameLoop, 1000);
}

document.addEventListener('keyup', checkWord);
gameLoop();
